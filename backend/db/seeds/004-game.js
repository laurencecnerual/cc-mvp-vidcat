const baseURL = "https://api.rawg.io/api/games";
const RAWG_API_KEY_QUERY = "?key=" + process.env.RAWG_API_KEY;
const totalPages = 1000;

async function getRAWGDataByPage(pageNumber) {
  const fullURL = baseURL + RAWG_API_KEY_QUERY + "&page=" + pageNumber; 
  const rawResponse = await fetch(fullURL);
  const responseObject = await rawResponse.json();
  const originalGameObjectArray = responseObject.results;

  let newGameObjectArray = [];

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

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('game').del()

  for (let i = 0; i < totalPages; i++) {
    console.log("Retrieving page #" + Number(i+1));
    let gameObjectArray = await getRAWGDataByPage(i+1);
    await knex('game').insert(gameObjectArray);
  }

  console.log(`${totalPages} pages fetched and added successfully`);
};
