const express = require("express");
import { Request, Response } from "express";
const app = express();
const cors = require("cors");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const crypto = require("crypto");
import { signup, login, logout, getGamerProfile, updateGamer, sendUserID, getGameRecommendationsForUser } from './gamer/gamer.controller';
import { getConsoles, getSingleConsole, getUserConsoles, createUserConsole, removeUserConsole, getSingleUserConsole, updateUserConsole } from './userconsole/userconsole.controller'
import { getGames, getSingleGame, getGameScreenshots, getUserGames, createUserGame, removeUserGame, getUserGamesForConsole, getSingleUserGame, updateUserGame } from './usergame/usergame.controller'
import { checkIsAuthenticated, checkIsAuthorizedByParams, getGamerIDFromUserConsole, getGamerIDFromUserGame, checkIsAuthorizedByReqBody } from "./authMiddleware";
import { createFollowPair, getFollowPairsByType, removeFollowPair } from "./follower/follower.controller";

const sessionSecret = process.env.SESSION_SECRET || crypto.randomBytes(64).toString("hex");
const frontendURL = process.env.FRONT_END_URL;

const PORT = process.env.PORT || 8080;

app.use(express.json());

if (process.env.NODE_ENV_TYPE === "production") app.set('trust proxy', 1);

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
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      domain: undefined
    },
  })
);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the VidCat backend!");
});

app.post("/signup", signup);
app.patch("/gamer/:id", checkIsAuthenticated, checkIsAuthorizedByParams, updateGamer)
app.post("/login", login);
app.get("/session", checkIsAuthenticated, sendUserID);
app.post("/logout", logout);
app.get("/profile/:username", getGamerProfile);
app.get("/recommendation", checkIsAuthenticated, getGameRecommendationsForUser);

app.get("/console", getConsoles);
app.get("/console/:id", getSingleConsole);

app.get("/userconsole/:id", checkIsAuthenticated, getSingleUserConsole);
app.get("/gamer/:id/userconsole", checkIsAuthenticated, checkIsAuthorizedByParams, getUserConsoles);
app.post("/gamer/:id/userconsole", checkIsAuthenticated, checkIsAuthorizedByParams, createUserConsole);
app.patch("/userconsole/:id", checkIsAuthenticated, getGamerIDFromUserConsole, checkIsAuthorizedByReqBody, updateUserConsole);
app.delete("/userconsole/:id", checkIsAuthenticated, getGamerIDFromUserConsole, checkIsAuthorizedByReqBody, removeUserConsole);

app.get("/game", getGames);
app.get("/game/:id", getSingleGame);
app.get("/game/:id/screenshot", getGameScreenshots);

app.get("/usergame/:id", checkIsAuthenticated, getSingleUserGame);
app.get("/gamer/:id/usergame", checkIsAuthenticated, checkIsAuthorizedByParams, getUserGames);
app.post("/gamer/:id/usergame", checkIsAuthenticated, checkIsAuthorizedByParams, createUserGame);
app.patch("/usergame/:id", checkIsAuthenticated, getGamerIDFromUserGame, checkIsAuthorizedByReqBody, updateUserGame);
app.delete("/usergame/:id", checkIsAuthenticated, getGamerIDFromUserGame, checkIsAuthorizedByReqBody, removeUserGame);
app.get("/userconsole/:id/usergame", checkIsAuthenticated, getGamerIDFromUserConsole, checkIsAuthorizedByReqBody, getUserGamesForConsole);

app.get("/gamer/:id/follower", checkIsAuthenticated, checkIsAuthorizedByParams, getFollowPairsByType);
app.post("/gamer/:id/follower", checkIsAuthenticated, checkIsAuthorizedByParams, createFollowPair);
app.delete("/gamer/:id/follower/:followee_id", checkIsAuthenticated, checkIsAuthorizedByParams, removeFollowPair);

app.use((req: Request, res: Response) => {
  res.status(404).send("Route not found");
});

const server = app.listen(PORT, () => {
  console.log(`Express server is up and running on ${PORT}`);
});