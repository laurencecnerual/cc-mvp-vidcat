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
      picture: "https://upload.wikimedia.org/wikipedia/commons/b/b2/NES-Console-Set.png",
      is_handheld: false
    },
    {
      name: 'Super Famicom / Super Nintendo Entertainment System',
      maker: 'Nintendo',
      release_year: 1990,
      picture: "https://upload.wikimedia.org/wikipedia/commons/3/31/SNES-Mod1-Console-Set.jpg",
      is_handheld: false
    },
    {
      name: 'Game Boy',
      maker: 'Nintendo',
      release_year: 1989,
      picture: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Game-Boy-FL.png",
      is_handheld: true
    },
    {
      name: 'Game Gear',
      maker: 'Sega',
      release_year: 1990,
      picture: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Sega-Game-Gear-WB.png",
      is_handheld: true
    },
    {
      name: 'Sega Saturn',
      maker: 'Sega',
      release_year: 1994,
      picture: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Sega-Saturn-Console-Set-Mk2.png",
      is_handheld: false
    },
    {
      name: 'PlayStation',
      maker: 'Sony',
      release_year: 1994,
      picture: "https://upload.wikimedia.org/wikipedia/en/9/9e/PlayStation-SCPH-1000-with-Controller.png",
      is_handheld: false
    },
    {
      name: 'Nintendo 64',
      maker: 'Nintendo',
      release_year: 1996,
      picture: "https://upload.wikimedia.org/wikipedia/commons/1/11/N64-Console-Set.jpg",
      is_handheld: false
    },
    {
      name: 'Game Boy Color',
      maker: 'Nintendo',
      release_year: 1998,
      picture: "https://upload.wikimedia.org/wikipedia/commons/2/26/Nintendo_Game_Boy_Color.png",
      is_handheld: true
    },
    {
      name: 'Dreamcast',
      maker: 'Sega',
      release_year: 1998,
      picture: "https://upload.wikimedia.org/wikipedia/commons/0/07/Dreamcast-Console-Set.png",
      is_handheld: false
    },
    {
      name: 'PlayStation 2',
      maker: 'Sony',
      release_year: 2000,
      picture: "https://upload.wikimedia.org/wikipedia/commons/1/1c/PS2-Versions.jpg",
      is_handheld: false
    },
    {
      name: 'GameCube',
      maker: 'Nintendo',
      release_year: 2001,
      picture: "https://upload.wikimedia.org/wikipedia/commons/d/d1/GameCube-Set.jpg",
      is_handheld: false
    },
    {
      name: 'Xbox',
      maker: 'Microsoft',
      release_year: 2002,
      picture: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Xbox-Console-wDuke-L.jpg",
      is_handheld: false
    },
    {
      name: 'Game Boy Advance',
      maker: 'Nintendo',
      release_year: 2001,
      picture: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Nintendo-Game-Boy-Advance-Purple-FL.png",
      is_handheld: true
    },
    {
      name: 'Xbox 360',
      maker: 'Microsoft',
      release_year: 2006,
      picture: "https://upload.wikimedia.org/wikipedia/commons/4/40/Xbox-360-Pro-wController.jpg",
      is_handheld: false
    },
    {
      name: 'PlayStation 3',
      maker: 'Sony',
      release_year: 2006,
      picture: "https://upload.wikimedia.org/wikipedia/commons/e/e9/PS3_consoles_montage.png",
      is_handheld: false
    },
    {
      name: 'Wii',
      maker: 'Nintendo',
      release_year: 2006,
      picture: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Wii-Console.png",
      is_handheld: false
    },
    {
      name: 'Nintendo DS',
      maker: 'Nintendo',
      release_year: 2004,
      picture: "https://upload.wikimedia.org/wikipedia/commons/c/c4/DSLite_white_trans.png",
      is_handheld: true
    },
    {
      name: 'PlayStation Portable',
      maker: 'Sony',
      release_year: 2004,
      picture: "https://upload.wikimedia.org/wikipedia/commons/4/46/Psp-1000.jpg",
      is_handheld: true
    },
    {
      name: 'Wii U',
      maker: 'Nintendo',
      release_year: 2012,
      picture: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Wii_U_Console_and_Gamepad.png",
      is_handheld: false
    },
    {
      name: 'Nintendo Switch',
      maker: 'Nintendo',
      release_year: 2017,
      picture: "https://upload.wikimedia.org/wikipedia/commons/7/76/Nintendo-Switch-Console-Docked-wJoyConRB.jpg",
      is_handheld: false
    },
    {
      name: 'PlayStation 4',
      maker: 'Sony',
      release_year: 2014,
      picture: "https://upload.wikimedia.org/wikipedia/commons/7/7e/PS4-Console-wDS4.jpg",
      is_handheld: false
    },
    {
      name: 'Xbox One',
      maker: 'Microsoft',
      release_year: 2014,
      picture: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Xbox_One_consoles_montage.png",
      is_handheld: false
    },
    {
      name: 'Nintendo 3DS',
      maker: 'Nintendo',
      release_year: 2011,
      picture: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Nintendo-3DS-AquaOpen.png/1024px-Nintendo-3DS-AquaOpen.png",
      is_handheld: true
    },
    {
      name: 'Nintendo Switch Lite',
      maker: 'Nintendo',
      release_year: 2019,
      picture: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Nintendo_Switch_Lite_Grey_-_01.jpg",
      is_handheld: true
    },
    {
      name: 'PlayStation Vita',
      maker: 'Sony',
      release_year: 2011,
      picture: "https://upload.wikimedia.org/wikipedia/commons/b/b4/PlayStation-Vita-1101-FL.jpg",
      is_handheld: true
    },
    {
      name: 'PlayStation 5',
      maker: 'Sony',
      release_year: 2020,
      picture: "https://upload.wikimedia.org/wikipedia/commons/7/77/Black_and_white_Playstation_5_base_edition_with_controller.png",
      is_handheld: false
    },
    {
      name: 'Xbox Series X / Series S',
      maker: 'Microsoft',
      release_year: 2020,
      picture: "https://upload.wikimedia.org/wikipedia/commons/5/54/Xbox_Series_S_with_controller.jpg",
      is_handheld: false
    },
    {
      name: 'Steam Deck',
      maker: 'Valve',
      release_year: 2022,
      picture: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Steam_Deck_%28front%29.png",
      is_handheld: true
    },
    {
      name: 'Nintendo Switch 2',
      maker: 'Nintendo',
      release_year: 2025,
      picture: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Nintendo_Switch_2-Spieleequipment_20250605.png",
      is_handheld: false
    }
  ]);
};
