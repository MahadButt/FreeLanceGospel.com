exports.up = function(knex) {
    return knex.schema.createTable("blog_comments", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        
        table.integer("blog_id").unsigned();
        table.integer("u_id").unsigned();
        table.text("comment", "mediumtext").notNullable();

        table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.foreign("blog_id").references("id").inTable("blog").onDelete("CASCADE");
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("blog_comments");
};