const express = require("express");
import { Request, Response } from "express";
const app = express();
const cors = require("cors");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const crypto = require("crypto");
import { signup, login, logout, getGamerProfile, updateGamer } from './gamer/gamer.controller';
import { getConsoles, getSingleConsole, getUserConsoles, createUserConsole, removeUserConsole, getSingleUserConsole, updateUserConsole } from './userconsole/userconsole.controller'
import { getGames, getSingleGame, getUserGames, createUserGame, removeUserGame, getUserGamesForConsole, getSingleUserGame, updateUserGame } from './usergame/usergame.controller'
import { checkIsAuthenticated, checkIsAuthorizedByParams, getGamerIDFromUserConsole, getGamerIDFromUserGame, checkIsAuthorizedByReqBody } from "./authMiddleware";

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
    cookie: { 
      path: "/", 
      httpOnly: true, 
      secure: process.env.NODE_ENV_TYPE === "production", 
      sameSite: process.env.NODE_ENV_TYPE === "production" ? "None" : "Lax",
      maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the VidCat backend!");
});

app.post("/signup", signup);
app.patch("/gamer/:id", checkIsAuthenticated, checkIsAuthorizedByParams, updateGamer)
app.post("/login", login);
app.post("/logout", logout);
app.get("/profile/:username", getGamerProfile);

app.get("/console", checkIsAuthenticated, getConsoles);
app.get("/console/:id", checkIsAuthenticated, getSingleConsole);

app.get("/userconsole/:id", checkIsAuthenticated, getSingleUserConsole);
app.get("/gamer/:id/userconsole", checkIsAuthenticated, checkIsAuthorizedByParams, getUserConsoles);
app.post("/gamer/:id/userconsole", checkIsAuthenticated, checkIsAuthorizedByParams, createUserConsole);
app.patch("/userconsole/:id", checkIsAuthenticated, getGamerIDFromUserConsole, checkIsAuthorizedByReqBody, updateUserConsole);
app.delete("/userconsole/:id", checkIsAuthenticated, getGamerIDFromUserConsole, checkIsAuthorizedByReqBody, removeUserConsole);

app.get("/game", checkIsAuthenticated, getGames);
app.get("/game/:id", checkIsAuthenticated, getSingleGame);

app.get("/usergame/:id", checkIsAuthenticated, getSingleUserGame);
app.get("/gamer/:id/usergame", checkIsAuthenticated, checkIsAuthorizedByParams, getUserGames);
app.post("/gamer/:id/usergame", checkIsAuthenticated, checkIsAuthorizedByParams, createUserGame);
app.patch("/usergame/:id", checkIsAuthenticated, getGamerIDFromUserGame, checkIsAuthorizedByReqBody, updateUserGame);
app.delete("/usergame/:id", checkIsAuthenticated, getGamerIDFromUserGame, checkIsAuthorizedByReqBody, removeUserGame);
app.get("/userconsole/:id/usergame", checkIsAuthenticated, getGamerIDFromUserConsole, checkIsAuthorizedByReqBody, getUserGamesForConsole);

const server = app.listen(PORT, () => {
  console.log(`Express server is up and running on ${PORT}`);
});