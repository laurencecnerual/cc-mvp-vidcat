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
      username: 'laurencecnerual',
      firstname: 'Laurence',
      lastname: 'Agina',
      salted_hash: await bcrypt.hash("yolo", 10),
      profile_picture: 'https://media.licdn.com/dms/image/v2/D5603AQEzuhM0k7sO5Q/profile-displayphoto-shrink_800_800/B56ZPfWysSH0Ac-/0/1734619114731?e=1745452800&v=beta&t=53nOlkdfPWqLAiFbY4nACPd476ZVSJGSW_hcuvHV_Zk'
    },
  ]);
};
