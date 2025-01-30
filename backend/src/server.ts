const knex = require("./knex");
const express = require("express");
import { Request, Response } from "express";
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const crypto = require("crypto");

const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(64).toString("hex");
const frontendURL = process.env.FRONT_END_URL || "http://localhost:5173";

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(
  cors({
    origin: frontendURL,
    credentials: true, // Allow credentials (cookies) to be sent
  })
);
app.options("*", cors());

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    cookie: { path: "/", httpOnly: true, secure: false, maxAge: null }, // Currently using all of the default values explicitly
  })
);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to VidCat backend!");
});

app.post("/signup", async (req: Request, res: Response) => {
  const { username, password, firstname, lastname } = req.body;

  if (!username || !password) {
    return res.status(400).send("Both Username and Password are required");
  }

  const userFound = await getGamerByUsername(username);

  if (userFound) {
    return res.status(400).send("User Already Exists");
  }

  const saltedHash = await hashPassword(password);

  let newChatUser = {
    username: username,
    salted_hash: saltedHash,
    firstname: firstname,
    lastname: lastname
  };

  const userCreated = await addUser(newChatUser);
  delete userCreated.salted_hash;

  res.status(201).json(userCreated);
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Both Username and Password are required");
  }

  const user = await getGamerByUsername(username);

  if (!user) {
    return res.status(404).send("User Not Found");
  }

  const saltedHash = user.salted_hash;
  const authenicationResult = await verifyPassword(password, saltedHash); //Checks that password is OK

  if (!authenicationResult) {
    return res.status(401).json({ authenticationSuccessful: authenicationResult });
  }

  req.session.username = user.username; //Gives the user a session because password was OK
  const lastLoginUpdateResult = await updateLastLogin(user.id, new Date()); //Updates last_login in the db and returns the updated user
  delete lastLoginUpdateResult.salted_hash;

  if (!lastLoginUpdateResult) {
    return res.status(500).send("Could Not Log In");
  }

  res.status(200).json({
    authenticationSuccessful: authenicationResult,
    gamer: lastLoginUpdateResult,
  });
});

app.post("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could Not Log Out");
    }
    res.clearCookie("connect.sid");
    res.status(200).send("Log Out Successful");
  });
});

app.get("/console", async (req: Request, res: Response) => {
  try {
    const allConsoles = await getAllConsolesOrderByName();
    res.status(200).json(allConsoles);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/console/:id", async (req: Request, res: Response) => {
  const consoleID = parseInt(req.params.id);

  try {
    const targetConsole = await getConsoleByID(consoleID);
    res.status(200).json(targetConsole[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/gamer/:id/userconsole", async (req: Request, res: Response) => {
  const userID = parseInt(req.params.id);

  try {
    const allConsolesForUser = await getAllUserConsoles(userID);
    res.status(200).json(allConsolesForUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/gamer/:id/userconsole", async (req: Request, res: Response) => {
  const userID = parseInt(req.params.id);
  const {consoleID, isOwned, isFavorite} = req.body;

  if (!userID || !consoleID) {
    return res.status(400).send("Gamer ID, Console ID, isOwned, and isFavorite are all required");
  }

  const newUserConsole = {
    gamer_id: userID,
    console_id: consoleID,
    is_owned: isOwned,
    is_favorite: isFavorite
  };

  try {
    const newlyAdded = await addUserConsole(newUserConsole);
    res.status(200).json(newlyAdded);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/game", async (req: Request, res: Response) => {
  try {
    const allGames = await getAllGamesOrderByName();
    res.status(200).json(allGames);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/game/:id", async (req: Request, res: Response) => {
  const gameID = parseInt(req.params.id);

  try {
    const targetGame = await getGameByID(gameID);
    res.status(200).json(targetGame);
  } catch (err) {
    res.status(500).send(err);
  }
});

// app.get("/gamer/:id/usergame", async (req: Request, res: Response) => {
//   const userID = parseInt(req.params.id);

//   try {
//     const allGamesForUser = await getAllUserGames(userID);
//     res.status(200).json(allGamesForUser);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

app.get("/userconsole/:id/usergame", async (req: Request, res: Response) => {
  const userConsoleID = parseInt(req.params.id);

  try {
    const allGamesForUserConsole = await getAllUserConsoleGames(userConsoleID);
    res.status(200).json(allGamesForUserConsole);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/gamer/:id/usergame", async (req: Request, res: Response) => {
  const userID = parseInt(req.params.id);
  const {gameID, userConsoleID, isOwned, isCompleted, isFavorite, personalRating, personalReview} = req.body;

  if (!userID || !gameID || !userConsoleID) {
    return res.status(400).send("Gamer ID, Game ID, UserConsole ID, isOwned, isCompleted, isFavorite, personalRating, and personalReview are all required");
  }

  const newUserGame = {
    game_id: gameID,
    userconsole_id: userConsoleID,
    is_owned: isOwned,
    is_completed: isCompleted,
    is_favorite: isFavorite,
    personal_rating: personalRating,
    personal_review: personalReview
  };

  try {
    const newlyAdded = await addUserGame(newUserGame);
    res.status(200).json(newlyAdded[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});

//for new user creation
async function hashPassword(plainTextPassword) {
  const saltRounds = 10; //the higher the more secure but more time-consuming
  try {
    const hash = await bcrypt.hash(plainTextPassword, saltRounds); //applies salt and hashes the password
    return hash;
  } catch (err) {
    console.error("Hashing error:", err);
  }
}

//for existing user login
async function verifyPassword(plainTextPassword, hashedPasswordFromDB) {
  try {
    const match = await bcrypt.compare(plainTextPassword, hashedPasswordFromDB); //the salt can be implicitly extracted from the hashed password
    return match;
  } catch (err) {
    console.error("Verification error:", err);
  }
}

const GAMER_TABLE = "gamer";
const CONSOLE_TABLE = "console";
const USERCONSOLE_TABLE = "userconsole";
const GAME_TABLE = "game";
const USERGAME_TABLE = "usergame";

function getGamerByUsername(username) {
  return knex
    .select("*")
    .from(GAMER_TABLE)
    .where({ username: username })
    .first();
}

function updateLastLogin(id, lastLogin) {
  return knex(GAMER_TABLE)
    .returning("*")
    .first()
    .where({ id: id })
    .update({ last_login: lastLogin });
}

//returns an array of objects, even if just one row being added
function addUser(newUserObject) {
  return knex
    .returning("*")
    .first()
    .insert(newUserObject)
    .into(GAMER_TABLE);
}

function getAllConsolesOrderByName() {
  return knex
    .select("*")
    .from(CONSOLE_TABLE)
    .orderBy("name", "asc");
}

function getAllConsolesOrderByYear() {
  return knex
    .select("*")
    .from(CONSOLE_TABLE)
    .orderBy("release_year", "desc");
}

function getConsoleByID(consoleID) {
  return knex
  .select("*")
  .from(CONSOLE_TABLE)
  .where({id: consoleID});
}

function getAllUserConsoles(userID) {
  return knex
    .select("*")
    .from(USERCONSOLE_TABLE)
    .where({ "userconsole.gamer_id": userID })
    .orderBy("userconsole.id", "asc");
}

function addUserConsole(userConsole) {
  return knex
  .returning("*")
  .first()
  .insert(userConsole)
  .into(USERCONSOLE_TABLE);
}

function getAllGamesOrderByName() {
  return knex
    .select("*")
    .from(GAME_TABLE)
    .orderBy("name", "asc");
}

function getAllGamesOrderByReleaseDate() {
  return knex
    .select("*")
    .from(GAME_TABLE)
    .orderBy("released", "desc");
}

function getGameByID(gameID) {
  return knex
  .select("*")
  .from(GAME_TABLE)
  .where({rawg_id: gameID})
  .first();
}

// function getAllUserGames(userID) {
//   return knex
//     .select("*")
//     .from(USERGAME_TABLE)
//     .where({ "userconsole.gamer_id": userID })
//     .leftJoin("userconsole", "usergame.userconsole_id", "userconsole.id")
//     .orderBy("id", "asc");
// }

function getAllUserConsoleGames(userConsoleID) {
  return knex
    .select("*")
    .from(USERGAME_TABLE)
    .where({ "userconsole_id": userConsoleID })
    .orderBy("id", "asc");
}

function addUserGame(userGame) {
  return knex
  .returning("*")
  .insert(userGame)
  .into(USERGAME_TABLE);
}

const server = app.listen(PORT, () => {
  console.log(`Express server is up and running on ${PORT}`);
});