
exports.up = function (knex) {
    return knex.schema.table('contact_us', function (table) {
        table.string('type');
    })
};

exports.down = function (knex) {
    return knex.schema.table('contact_us', function (table) {
        table.dropColumn('type')
    })
};
