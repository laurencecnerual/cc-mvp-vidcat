/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("usergame", (table) => {
    table.increments("id").primary();
    table.integer('gamer_id').notNullable();
    table.foreign('gamer_id').references("id").inTable("gamer");
    table.integer('userconsole_id').notNullable();
    table.foreign('userconsole_id').references("id").inTable("userconsole");
    table.integer('game_id').notNullable();
    table.foreign('game_id').references("rawg_id").inTable("game");
    table.boolean('is_owned').defaultTo(true);
    table.boolean('is_completed').defaultTo(false);
    table.boolean('is_favorite').defaultTo(false);
    table.decimal("personal_rating", 3, 2);
    table.string("personal_review");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable("usergame");
};
