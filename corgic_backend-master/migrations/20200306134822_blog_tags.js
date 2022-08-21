
exports.up = function(knex) {
    return knex.schema.createTable("blog_tags", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        
        table.integer("blog_id").unsigned();
        table.integer("tag_id").unsigned();        

        table.foreign("blog_id").references("id").inTable("blog").onDelete("CASCADE");
        table.foreign("tag_id").references("id").inTable("tags").onDelete("CASCADE");
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("blog_tags");
};