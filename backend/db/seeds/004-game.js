const baseURL = "https://api.rawg.io/api/games";
const RAWG_API_KEY_QUERY = "?key=" + process.env.RAWG_API_KEY;
let currentPage = 1;

function getNextPageQuery() {
  const PAGE_QUERY = "&page=" + currentPage;
  currentPage++;
  return PAGE_QUERY;
}

async function getRAWGDataByPage() {
  const fullURL = baseURL + RAWG_API_KEY_QUERY + getNextPageQuery(); 
  const responseObject = await fetch(fullURL);
  const originalGameObjectArray = responseObject.results;

  let newGameObjectArray  = [];

  originalGameObjectArray.forEach((originalGameObject) => {
    let newGameObject = {
      rawg_id: originalGameObject.id,
      name: originalGameObject.name,
      lookup_name: originalGameObject.slug,
      released: originalGameObject.released,
      rating: originalGameObject.rating,
      background_image_link: originalGameObject.background_image
    };

    newGameObjectArray.push(newGameObject);
  });

  return newGameObjectArray;
}

function getGameObjects() {
  let gameObjectArray = [];

  for (let i = 0; i < 50; i++) {
    gameObjectArray = gameObjectArray.concat(getRAWGDataByPage());
  }

  return gameObjectArray;
}

const seedData = getGameObjects();


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('game').del()
  await knex('game').insert(seedData);
};
