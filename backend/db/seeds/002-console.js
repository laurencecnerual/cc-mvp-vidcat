/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('console').del()
  await knex('console').insert([
    {
      name: 'Famicon / Nintendo Entertainment System',
      maker: 'Nintendo',
      release_year: 1983,
      is_handheld: false
    },
    {
      name: 'Super Famicom / Super Nintendo Entertainment System',
      maker: 'Nintendo',
      release_year: 1990,
      is_handheld: false
    },
    {
      name: 'Game Boy',
      maker: 'Nintendo',
      release_year: 1989,
      is_handheld: true
    },
    {
      name: 'Game Gear',
      maker: 'Sega',
      release_year: 1990,
      is_handheld: true
    },
    {
      name: 'Sega Saturn',
      maker: 'Sega',
      release_year: 1994,
      is_handheld: false
    },
    {
      name: 'PlayStation',
      maker: 'Sony',
      release_year: 1994,
      is_handheld: false
    },
    {
      name: 'Nintendo 64',
      maker: 'Nintendo',
      release_year: 1996,
      is_handheld: false
    },
    {
      name: 'Game Boy Color',
      maker: 'Nintendo',
      release_year: 1998,
      is_handheld: true
    },
    {
      name: 'Dreamcast',
      maker: 'Sega',
      release_year: 1998,
      is_handheld: false
    },
    {
      name: 'PlayStation 2',
      maker: 'Sony',
      release_year: 2000,
      is_handheld: false
    },
    {
      name: 'GameCube',
      maker: 'Nintendo',
      release_year: 2001,
      is_handheld: false
    },
    {
      name: 'Xbox',
      maker: 'Microsoft',
      release_year: 2002,
      is_handheld: false
    },
    {
      name: 'Game Boy Advance',
      maker: 'Nintendo',
      release_year: 2001,
      is_handheld: true
    },
    {
      name: 'Xbox 360',
      maker: 'Microsoft',
      release_year: 2006,
      is_handheld: false
    },
    {
      name: 'PlayStation 3',
      maker: 'Sony',
      release_year: 2006,
      is_handheld: false
    },
    {
      name: 'Wii',
      maker: 'Nintendo',
      release_year: 2006,
      is_handheld: false
    },
    {
      name: 'Nintendo DS',
      maker: 'Nintendo',
      release_year: 2004,
      is_handheld: true
    },
    {
      name: 'PlayStation Portable',
      maker: 'Sony',
      release_year: 2004,
      is_handheld: true
    },
    {
      name: 'Wii U',
      maker: 'Nintendo',
      release_year: 2012,
      is_handheld: false
    },
    {
      name: 'Nintendo Switch',
      maker: 'Nintendo',
      release_year: 2017,
      is_handheld: false
    },
    {
      name: 'PlayStation 4',
      maker: 'Sony',
      release_year: 2014,
      is_handheld: false
    },
    {
      name: 'Xbox One',
      maker: 'Microsoft',
      release_year: 2014,
      is_handheld: false
    },
    {
      name: 'Nintendo 3DS',
      maker: 'Nintendo',
      release_year: 2011,
      is_handheld: true
    },
    {
      name: 'Nintendo Switch Lite',
      maker: 'Nintendo',
      release_year: 2019,
      is_handheld: true
    },
    {
      name: 'PlayStation Vita',
      maker: 'Sony',
      release_year: 2011,
      is_handheld: true
    },
    {
      name: 'PlayStation 5',
      maker: 'Sony',
      release_year: 2020,
      is_handheld: false
    },
    {
      name: 'Xbox Series X / Series S',
      maker: 'Microsoft',
      release_year: 2020,
      is_handheld: false
    },
  ]);
};
