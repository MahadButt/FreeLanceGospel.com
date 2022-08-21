
exports.up = function (knex) {
    return knex.schema.table('blog_cat', function (table) {
        table.integer('active').defaultTo(1)
    }).table('blog_subcat', function (table) {
        table.integer('active').defaultTo(1)
    })
};

exports.down = function (knex) {
    return knex.schema.table('blog_cat', function (table) {
        table.dropColumn('active')
    }).table('blog_subcat', function (table) {
        table.dropColumn('active')
    })
};
