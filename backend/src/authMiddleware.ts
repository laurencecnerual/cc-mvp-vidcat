import { Request, Response, NextFunction } from "express";
import { getUserConsoleByID } from "./userconsole/userconsole.model";
import { getUserGameByID } from "./usergame/usergame.model";

export function checkIsAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.gamer_id) {
    next();
  } else {
    return res.status(401).send("User Not Logged In");
  }
};

export function checkIsAuthorizedByParams(req: Request, res: Response, next: NextFunction) {
  const gamerID = parseInt(req.params.id);
  
  if (req.session.gamer_id === gamerID) {
    next();
  } else {
    return res.status(403).send("User Not Authorized");
  }
};

export async function getGamerIDFromUserConsole(req: Request, res: Response, next: NextFunction) {
  try {
    const userConsoleID = parseInt(req.params.id);
    const userConsole = await getUserConsoleByID(userConsoleID);
    const gamerID = userConsole.gamer_id;
    req.body.gamerID = gamerID;
    next();
  } catch (err) {
    res.status(500).send(err);
  }
};

export async function getGamerIDFromUserGame(req: Request, res: Response, next: NextFunction) {
  try {
    const userGameID = parseInt(req.params.id);
    const userGame = await getUserGameByID(userGameID);
    const gamerID = userGame.gamer_id;
    req.body.gamerID = gamerID;
    next();
  } catch (err) {
    res.status(500).send(err);
  }
};

export function checkIsAuthorizedByReqBody(req: Request, res: Response, next: NextFunction) {
  const gamerID = req.body.gamerID;

  if (req.session.gamer_id !== gamerID) {
    return res.status(403).send("User Not Authorized");
  }

  next();
};