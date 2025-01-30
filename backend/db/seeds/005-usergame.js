/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('usergame').del()
  await knex('usergame').insert([
    {
      gamer_id: 1,
      userconsole_id: 1,
      game_id: 12020,
      is_favorite: true,
      personal_rating: 4.7,
      personal_review: "Scary and lots of fun. Great for co-op.",
    },
    {
      gamer_id: 1,
      userconsole_id: 2,
      game_id: 23027,
      personal_rating: 4.3,
      personal_review: 'An engaging story with high replay value.',
    },
    {
      gamer_id: 1,
      userconsole_id: 3,
      game_id: 3328,
      is_completed: false,
    },
    {
      gamer_id: 1,
      userconsole_id: 4,
      game_id: 278,
      is_owned: false,
    },
  ]);
};
