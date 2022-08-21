
exports.up = function(knex) {
    return knex.schema.createTable("blog_cat", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.string("category_name", 255);
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("blog_cat");
};