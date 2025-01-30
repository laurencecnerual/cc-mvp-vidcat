/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("console", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.string("maker").notNullable();
    table.integer("release_year");
    table.string("picture");
    table.boolean('is_handheld');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable("console");
};
