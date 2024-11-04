const bcrypt = require("bcrypt");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('gamer').del()
  await knex('gamer').insert([
    {
      username: 'eyeofkira',
      firstname: 'Laurence',
      lastname: 'Agina',
      salted_hash: await bcrypt.hash("yolo", 10),
    },
  ]);
};
