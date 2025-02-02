import { getAllConsolesOrderByName, getConsoleByID, getAllUserConsoles, addUserConsole, deleteUserConsoleByID, getUserConsoleByID } from './userconsole.model'; 
import { getAllUserConsoleGames, deleteUserGameByID } from '../usergame/usergame.model'; 
import { Request, Response } from "express";

export const getConsoles = async (req: Request, res: Response) => {
  try {
    const allConsoles = await getAllConsolesOrderByName();
    res.status(200).json(allConsoles);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getSingleConsole = async (req: Request, res: Response) => {
  const consoleID = parseInt(req.params.id);

  try {
    const targetConsole = await getConsoleByID(consoleID);
    res.status(200).json(targetConsole[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getUserConsoles = async (req: Request, res: Response) => {
  const userID = parseInt(req.params.id);

  try {
    const allConsolesForUser = await getAllUserConsoles(userID);
    res.status(200).json(allConsolesForUser);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getSingleUserConsole = async (req: Request, res: Response) => {
  const userConsoleID = parseInt(req.params.id);

  try {
    const targetUserConsole = await getUserConsoleByID(userConsoleID);
    res.status(200).json(targetUserConsole[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const createUserConsole = async (req: Request, res: Response) => {
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
    res.status(200).json(newlyAdded[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const removeUserConsole = async (req: Request, res: Response) => {
  const userConsoleID = parseInt(req.params.id);

  try { //check for and delete the associated games before deleting the console
    const deletedUserGames = await getAllUserConsoleGames(userConsoleID);

    for (let userGame of deletedUserGames) {
      await deleteUserGameByID(userGame.id);
    }

    const deletedUserConsoles = await deleteUserConsoleByID(userConsoleID);

    if (!deletedUserConsoles[0]) {
      return res.status(400).send("The UserConsole Does Not Exist");
    }

    const payload = {
      userconsole: deletedUserConsoles[0],
      usergames: deletedUserGames
    };

    res.status(200).send(payload);
  } catch (err) {
    res.status(500).send(err);
  }
}