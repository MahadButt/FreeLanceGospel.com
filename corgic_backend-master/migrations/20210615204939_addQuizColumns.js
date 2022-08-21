
exports.up = function(knex) {
    return knex.schema.table('quiz', function(table) {
        table.integer('quiz_level').defaultTo(null)
        table.integer('total_coins').defaultTo(null)
        table.integer('level_unlock').defaultTo(null)
      })
};

exports.down = function(knex) {
    return knex.schema.table('quiz', function(table) {
        table.dropColumn('quiz_level')
        table.dropColumn('total_coins')
        table.dropColumn('level_unlock')
      })
};
