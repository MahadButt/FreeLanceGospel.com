
exports.up = function(knex) {
    return knex.schema.createTable("rank_title", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.string("name", 512);
        table.text("image_url", "longtext").notNullable();
        table.timestamps(false, true);
    }).createTable("user_rank_title", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.integer("u_id").unsigned().notNullable();
        table.integer("cat_id").unsigned().notNullable();
        table.integer("title_id").unsigned().notNullable();
        table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.foreign("cat_id").references("id").inTable("quiz_categories").onDelete("CASCADE");
        table.foreign("title_id").references("id").inTable("rank_title").onDelete("CASCADE");
        table.timestamps(false, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("user_rank_title").dropTable("rank_title");
};
