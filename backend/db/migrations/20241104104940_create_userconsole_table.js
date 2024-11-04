/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("userconsole", (table) => {
    table.increments("id").primary();
    table.integer('gamer_id').notNullable();
    table.foreign('gamer_id').references("id").inTable("gamer");
    table.integer('console_id').notNullable();
    table.foreign('console_id').references("id").inTable("console");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable("userconsole");
};
