
exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
        table.string('resetPassToken').defaultTo(null)
        table.string('resetPassExpires').defaultTo(null)
      })
};

exports.down = function(knex) {
    return knex.schema.table('users', function(table) {
        table.dropColumn('resetPassToken')
        table.dropColumn('resetPassExpires')
      })
};
