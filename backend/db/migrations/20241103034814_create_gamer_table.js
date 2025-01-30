/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("gamer", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("firstname");
    table.string("lastname");
    table.string("salted_hash").notNullable();
    table.string("profile_picture");
    table.timestamp("account_created").defaultTo(knex.fn.now());
    table.timestamp("last_login");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable("gamer");
};
