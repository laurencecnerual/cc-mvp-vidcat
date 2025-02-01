const knex = require("./knex");
const express = require("express");
import { Request, Response } from "express";
const app = express();
const cors = require("cors");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const crypto = require("crypto");
import { signup, login, logout } from './gamer/gamer.controller';
import { getConsoles, getSingleConsole, getUserConsoles, createUserConsole } from './userconsole/userconsole.controller'
import * as UserGameController from './usergame/usergame.controller'


const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(64).toString("hex");
const frontendURL = process.env.FRONT_END_URL || "http://localhost:5173";

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(
  cors({
    origin: frontendURL,
    credentials: true
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
  res.send("Welcome to the VidCat backend!");
});

app.post("/signup", signup);
app.post("/login", login);
app.post("/logout", logout);

app.get("/console", getConsoles);
app.get("/console/:id", getSingleConsole);
app.get("/gamer/:id/userconsole", getUserConsoles);
app.post("/gamer/:id/userconsole", createUserConsole);

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

app.get("/gamer/:id/usergame", async (req: Request, res: Response) => {
  const userID = parseInt(req.params.id);

  try {
    const allGamesForUser = await getAllUserGames(userID);
    res.status(200).json(allGamesForUser);
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
    gamer_id: userID,
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

// app.get("/profile/:username", async (req: Request, res: Response) => {
//   const username = req.params.username;
//   const gamer = await getGamerByUsername(username);

//   if (!gamer) {
//     res.status(500).send("User Not Found");
//   }

//   try {
//     const allConsolesForUser = await getAllUserConsoles(gamer.id);
//     const allGamesForUser = await getAllUserGames(gamer.id);
//     res.status(200).json({
//       userconsoles: allConsolesForUser,
//       usergames: allGamesForUser
//     });
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

const GAME_TABLE = "game";
const USERGAME_TABLE = "usergame";

function getAllGamesOrderByName(): Promise<Game[]> {
  return knex
    .select("*")
    .from(GAME_TABLE)
    .orderBy("name", "asc");
}

function getGameByID(gameID: number): Promise<Game> {
  return knex
  .select("*")
  .from(GAME_TABLE)
  .where({rawg_id: gameID})
  .first();
}

function getAllUserGames(userID: number): Promise<UserGameWithGameData[]> {
  return knex
    .select("*")
    .from(USERGAME_TABLE)
    .where({ "usergame.gamer_id": userID })
    .leftJoin("game", "usergame.game_id", "game.rawg_id")
    .orderBy("id", "asc");
}

function addUserGame(userGame: UserGame): Promise<UserGame> {
  return knex
  .returning("*")
  .insert(userGame)
  .into(USERGAME_TABLE);
}

const server = app.listen(PORT, () => {
  console.log(`Express server is up and running on ${PORT}`);
});