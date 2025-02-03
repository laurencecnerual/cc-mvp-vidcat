import { getAllGamesOrderByName, getGameByID, getAllUserGames, addUserGame, deleteUserGameByID, getAllUserConsoleGames, getUserGameByID, updateUserGameByID } from './usergame.model'; 
import { Request, Response } from "express";

export const getGames = async (req: Request, res: Response) => {
  try {
    const allGames = await getAllGamesOrderByName();
    res.status(200).json(allGames);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getSingleGame = async (req: Request, res: Response) => {
  const gameID = parseInt(req.params.id);

  try {
    const targetGame = await getGameByID(gameID);
    res.status(200).json(targetGame);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getUserGames = async (req: Request, res: Response) => {
  const userID = parseInt(req.params.id);

  try {
    const allGamesForUser = await getAllUserGames(userID);
    res.status(200).json(allGamesForUser);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getSingleUserGame = async (req: Request, res: Response) => {
  const userGameID = parseInt(req.params.id);

  try {
    const targetUserGame = await getUserGameByID(userGameID);
    res.status(200).json(targetUserGame);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const createUserGame = async (req: Request, res: Response) => {
  const userID = parseInt(req.params.id);
  const {gameID, userConsoleID, isOwned, isCompleted, isFavorite, personalRating, personalReview} = req.body;

  if (!userID || !gameID || !userConsoleID) {
    return res.status(400).send("Gamer ID, Game ID, UserConsole ID, isOwned, isCompleted, isFavorite, personalRating, and personalReview are all required");
  }

  const userGames = await getAllUserGames(userID);

  if (userGames.find((ug) => ug.game_id === gameID)) {
    return res.status(400).send("UserGame Already Exists");
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
    res.status(201).json(newlyAdded[0]);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const updateUserGame = async (req: Request, res: Response) => {
  const userGameID = parseInt(req.params.id);
  const { isOwned, isCompleted, isFavorite, personalRating, personalReview } = req.body;

  const payload = {
    is_owned: isOwned, 
    is_completed: isCompleted,
    is_favorite: isFavorite, 
    personal_rating: personalRating,
    personal_review: personalReview
  };

  const modifiedUserGame = await updateUserGameByID(userGameID, payload);
  res.status(200).send(modifiedUserGame);

};

export const removeUserGame = async (req: Request, res: Response) => {
  const userGameID = parseInt(req.params.id);

  try {
    const deletedUserGames = await deleteUserGameByID(userGameID);

    if (!deletedUserGames[0]) {
      return res.status(400).send("The UserGame Does Not Exist");
    }

    res.status(200).send(deletedUserGames[0]);
  } catch (err) {
    res.status(500).send(err);
  }
}

export const getUserGamesForConsole = async (req: Request, res: Response) => {
  const userConsoleID = parseInt(req.params.id);

  try {
    const allGamesForUserConsole = await getAllUserConsoleGames(userConsoleID);
    res.status(200).json(allGamesForUserConsole);
  } catch (err) {
    res.status(500).send(err);
  }
}