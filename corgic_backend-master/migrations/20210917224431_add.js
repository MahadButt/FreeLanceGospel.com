
exports.up = function(knex) {
    return knex.schema.raw('ALTER TABLE `member_week` RENAME TO `member_church`').table('member_church', function (table) {
        table.integer('isRead').defaultTo(0);
        table.string('description').defaultTo(null);
        table.string('member_type').defaultTo(null);
    });
};

exports.down = function(knex) {
    return knex.schema.table('member_church', function (table) {
        table.dropColumn('isRead')
        table.dropColumn('member_type')
        table.dropColumn('description')
    })
};
