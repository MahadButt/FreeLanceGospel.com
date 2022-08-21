
exports.up = function(knex) {
    return knex.schema.table('musics', function (table) {
        table.string('file_path');
    })
};

exports.down = function(knex) {
    return knex.schema.table('musics', function (table) {
        table.dropColumn('file_path')
    })
};
