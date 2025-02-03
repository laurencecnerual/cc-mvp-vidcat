const knex = require("../knex");

const CONSOLE_TABLE = "console";
const USERCONSOLE_TABLE = "userconsole";

export const getAllConsolesOrderByName = (): Promise<Console[]> => {
  return knex
    .select("*")
    .from(CONSOLE_TABLE)
    .orderBy("name", "asc");
};

export const getConsoleByID = (consoleID: number): Promise<Console> => {
  return knex
  .select("*")
  .from(CONSOLE_TABLE)
  .where({id: consoleID});
};

export const getAllUserConsoles = (userID: number): Promise<UserConsoleWithConsoleData[]> => {
  return knex
    .select("*")
    .from(USERCONSOLE_TABLE)
    .where({ "userconsole.gamer_id": userID })
    .leftJoin("console", "userconsole.console_id", "console.id")
    .select("userconsole.id as id", "console.id as console_id")
    .orderBy("userconsole.id", "asc");
};

export const getUserConsoleByID = (userConsoleID: number): Promise<UserConsole> => {
  return knex
  .select("*")
  .from(USERCONSOLE_TABLE)
  .where({id: userConsoleID});
};

export const addUserConsole = (userConsole: UserConsole): Promise<UserConsole> => {
  return knex
  .returning("*")
  .insert(userConsole)
  .into(USERCONSOLE_TABLE);
};

export const updateById = (userConsoleID: number, payload: Partial<UserConsole>): Promise<UserConsole> => {
  return knex(USERCONSOLE_TABLE)
  .returning("*")
  .where({ id: userConsoleID })
  .update(payload);
};

export const deleteUserConsoleByID = (userConsoleID: number): Promise<UserConsole> => {
  return knex(USERCONSOLE_TABLE)
  .returning("*")
  .where({ id: userConsoleID })
  .del();
};