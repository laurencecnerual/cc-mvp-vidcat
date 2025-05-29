const knex = require("../knex");

const GAME_TABLE = "game";
const USERGAME_TABLE = "usergame";

export const getAllGamesOrderByName = (): Promise<Partial<Game>[]> => {
  return knex
    .select("rawg_id","name")
    .from(GAME_TABLE)
    .orderBy("name", "asc");
};

export const getGamesByPage = (page: number, limit: number): Promise<Game[]> => {
  const offset = (page - 1) * limit;

  return knex
    .select("*")
    .from(GAME_TABLE)
    .orderBy("name", "asc")
    .limit(limit)
    .offset(offset);
};

export const getGameCount = async (): Promise<number> => {
  const result = await knex(GAME_TABLE)
  .count('rawg_id as count');

  return Number(result[0].count);
};

export const getGameByID = (gameID: number): Promise<Game> => {
  return knex
  .select("*")
  .from(GAME_TABLE)
  .where({rawg_id: gameID})
  .first();
};

export const getAllUserGames = (userID: number): Promise<UserGameWithGameData[]> => {
  return knex
    .select("*")
    .from(USERGAME_TABLE)
    .where({ "usergame.gamer_id": userID })
    .leftJoin("game", "usergame.game_id", "game.rawg_id")
    .orderBy("id", "asc");
};

export const getUserGameByID = (userGameID: number): Promise<UserGame> => {
  return knex
  .select("*")
  .from(USERGAME_TABLE)
  .where({id: userGameID})
  .first();
}

export const addUserGame = (userGame: UserGame): Promise<UserGame> => {
  return knex
  .returning("*")
  .insert(userGame)
  .into(USERGAME_TABLE);
};

export const updateUserGameByID = (userGameID: number, payload: Partial<UserGame>): Promise<UserGame> => {
  return knex(USERGAME_TABLE)
  .returning("*")
  .where({ id: userGameID })
  .update(payload);
};

export const deleteUserGameByID = (userGameID: number): Promise<UserGame> => {
  return knex(USERGAME_TABLE)
  .returning("*")
  .where({ id: userGameID })
  .del();
};

export const getAllUserConsoleGames = (userConsoleID: number): Promise<UserGame[]> => {
  return knex
    .select("*")
    .from(USERGAME_TABLE)
    .where({ "userconsole_id": userConsoleID })
    .orderBy("id", "asc");
};