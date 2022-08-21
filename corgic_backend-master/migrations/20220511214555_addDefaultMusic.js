
exports.up = function(knex) {
    return knex.schema.table('musics', function (table) {
        table.string('is_default').defaultTo(0);
    })
};

exports.down = function(knex) {
    return knex.schema.table('musics', function (table) {
        table.dropColumn('is_default')
    })
};
