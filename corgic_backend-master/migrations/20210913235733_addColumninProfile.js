
exports.up = function(knex) {
    return knex.schema.table('users', function (table) {
        table.integer('age').defaultTo(0);
        table.string('ethnicity').defaultTo(null);
        table.string('region').defaultTo(null);
        table.string('sign').defaultTo(null);
        table.string('education').defaultTo(null);
        table.string('hobbies').defaultTo(null);
    });
};

exports.down = function(knex) {
    return knex.schema.table('users', function (table) {
        table.dropColumn('age')
        table.dropColumn('ethnicity')
        table.dropColumn('region')
        table.dropColumn('sign')
        table.dropColumn('education')
        table.dropColumn('hobbies')
    })
};
