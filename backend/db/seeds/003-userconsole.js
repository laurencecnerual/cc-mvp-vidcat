/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('userconsole').del()
  await knex('userconsole').insert([
    {
      gamer_id: 1,
      console_id: 14
    },
    {
      gamer_id: 1,
      console_id: 15
    },
    {
      gamer_id: 1,
      console_id: 20
    },
    {
      gamer_id: 1,
      console_id: 21
    },
    {
      gamer_id: 1,
      console_id: 23
    },
  ]);
};
