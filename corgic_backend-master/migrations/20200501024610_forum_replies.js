exports.up = function(knex) {
    return knex.schema.createTable("forum_replies", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.integer("u_id").unsigned();
        table.integer("post_id").unsigned();
        
        table.text("reply", "longtext").notNullable();

        table.foreign("u_id").references("u_id").inTable("users").onDelete("SET NULL");
        table.foreign("post_id").references("id").inTable("forum_post").onDelete("CASCADE");

        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("forum_replies");
};