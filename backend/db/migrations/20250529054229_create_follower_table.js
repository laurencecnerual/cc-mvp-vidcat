/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable("follower", (table) => {
    table.integer('follower_id').notNullable();
    table.foreign('follower_id').references('id').inTable('gamer');
    
    table.integer('followee_id').notNullable();
    table.foreign('followee_id').references('id').inTable('gamer');

    table.primary(['follower_id', 'followee_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTable("follower");
};
