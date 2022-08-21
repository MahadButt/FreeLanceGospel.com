
exports.up = function(knex) {
    return knex.schema.table('forum_post', function (table) {
        table.integer('active').defaultTo(1)
    }).table('forum_section', function (table) {
        table.integer('active').defaultTo(1)
    }).table('forum_topic', function (table) {
        table.integer('active').defaultTo(1)
    }).table('forum_replies', function (table) {
        table.integer('active').defaultTo(1)
    })
};

exports.down = function(knex) {
    return knex.schema.table('forum_post', function (table) {
        table.dropColumn('active')
    }).table('forum_section', function (table) {
        table.dropColumn('active')
    }).table('forum_topic', function (table) {
        table.dropColumn('active')
    }).table('forum_replies', function (table) {
        table.dropColumn('active')
    })
};
