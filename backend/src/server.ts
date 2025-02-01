const express = require("express");
import { Request, Response } from "express";
const app = express();
const cors = require("cors");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const crypto = require("crypto");
import { signup, login, logout } from './gamer/gamer.controller';
import { getConsoles, getSingleConsole, getUserConsoles, createUserConsole } from './userconsole/userconsole.controller'
import { getGames, getSingleGame, getUserGames, createUserGame, removeUserGame } from './usergame/usergame.controller'
import { getGamerByUsername } from "./gamer/gamer.model";
import { getAllUserConsoles } from "./userconsole/userconsole.model";
import { getAllUserGames } from "./usergame/usergame.model";


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
//app.delete("/gamer/:id/userconsole", removeUserConsole);

app.get("/game", getGames);
app.get("/game/:id", getSingleGame);

app.get("/gamer/:id/usergame", getUserGames);
app.post("/gamer/:id/usergame", createUserGame);
app.delete("/usergame/:id", removeUserGame);

//For public user profile (i.e. all userconsoles and usergames for the given gamer's username)
app.get("/profile/:username", async (req: Request, res: Response) => {
  const username = req.params.username;
  const gamer = await getGamerByUsername(username);

  if (!gamer) {
    return res.status(404).send("User Not Found");
  }

  try {
    const allConsolesForUser = await getAllUserConsoles(gamer.id);
    const allGamesForUser = await getAllUserGames(gamer.id);
    res.status(200).json({
      userconsoles: allConsolesForUser,
      usergames: allGamesForUser
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

const server = app.listen(PORT, () => {
  console.log(`Express server is up and running on ${PORT}`);
});