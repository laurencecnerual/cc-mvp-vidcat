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
      personal_review: "Scary and lots of fun. Great for co-op",
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
      personal_rating: 4.2,
    },
    {
      gamer_id: 1,
      userconsole_id: 4,
      game_id: 278,
      is_owned: false,
      personal_rating: 4.4,
    },
    {
      gamer_id: 1,
      userconsole_id: 4,
      game_id: 3070,
      is_favorite: true,
      is_completed: true,
      personal_rating: 4.8,
      personal_review: 'Seemingly endless open-world fun',

    },
    {
      gamer_id: 1,
      userconsole_id: 4,
      game_id: 236697,
      is_completed: true,
      personal_rating: 4.5,
      personal_review: 'Fun both alone and with a partner',
    },
    {
      gamer_id: 1,
      userconsole_id: 4,
      game_id: 28026,
      is_completed: true,
      personal_rating: 4.2,
      personal_review: 'Very cute, fun, and challenging',
    },
    {
      gamer_id: 1,
      userconsole_id: 4,
      game_id: 4286,
      is_favorite: true,
      is_completed: true,
      personal_rating: 5,
      personal_review: 'Such a cool world and idea! Very creepy.',
    },
    {
      gamer_id: 1,
      userconsole_id: 4,
      game_id: 3990,
      is_owned: true,
      personal_rating: 4.9,
      personal_review: 'Dark and real. Fun gameplay.',
    },
    {
      gamer_id: 1,
      userconsole_id: 4,
      game_id: 2553,
      is_completed: true,
      personal_rating: 4.3,
      personal_review: 'Lots of gadgets and weapons. Very exciting!',
    },
    {
      gamer_id: 1,
      userconsole_id: 4,
      game_id: 727315,
      is_owned: false,
      personal_review: 'I love this series. If I can just get a PS5...one day...',
    },
    {
      gamer_id: 1,
      userconsole_id: 4,
      game_id: 638654,
      is_owned: false,
      personal_review: 'I loved the original and am dying to see what they did with this remake',
    },
  ]);
};
