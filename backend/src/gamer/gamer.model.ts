const knex = require("../knex");

const GAMER_TABLE = "gamer";

export const getGamerByUsername = (username: string): Promise<Gamer> => {
  return knex
    .select("*")
    .from(GAMER_TABLE)
    .where({ username: username })
    .first();
};

export const updateLastLogin = (id: number, lastLogin: Date): Promise<Gamer> => {
  return knex(GAMER_TABLE)
    .returning("*")
    .where({ id: id })
    .update({ last_login: lastLogin });
};

export const addUser = (newUserObject: Gamer): Promise<Gamer> => {
  return knex
    .returning("*")
    .insert(newUserObject)
    .into(GAMER_TABLE);
};
