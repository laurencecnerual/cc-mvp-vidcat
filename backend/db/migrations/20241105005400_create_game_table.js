/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("game", (table) => {
    table.increments("id").primary();
    table.increments("rawg_id").notNullable().unique();
    table.string("name").notNullable();
    table.string("lookup_name").notNullable().unique();
    table.timestamp("released");
    table.decimal("rating", 3, 2)
    table.string("background_image_link");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable("game");
};
