const knex = require("../knex");

const GAME_TABLE = "game";
const USERGAME_TABLE = "usergame";

export const getAllGamesOrderByName = (): Promise<Game[]> => {
  return knex
    .select("*")
    .from(GAME_TABLE)
    .orderBy("name", "asc");
}

export const getGameByID = (gameID: number): Promise<Game> => {
  return knex
  .select("*")
  .from(GAME_TABLE)
  .where({rawg_id: gameID})
  .first();
}

export const getAllUserGames = (userID: number): Promise<UserGameWithGameData[]> => {
  return knex
    .select("*")
    .from(USERGAME_TABLE)
    .where({ "usergame.gamer_id": userID })
    .leftJoin("game", "usergame.game_id", "game.rawg_id")
    .orderBy("id", "asc");
}

export const addUserGame = (userGame: UserGame): Promise<UserGame> => {
  return knex
  .returning("*")
  .insert(userGame)
  .into(USERGAME_TABLE);
}

