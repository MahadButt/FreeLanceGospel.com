exports.up = function (knex) {
    return knex.schema.createTable("blog_subcat", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.string("subcat_name", 45).notNullable();
        table.integer("parent_id").unsigned();
        table.timestamps(false, true);
        table.foreign("parent_id").references("id").inTable("blog_cat").onDelete("SET NULL");
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("blog_subcat");
};