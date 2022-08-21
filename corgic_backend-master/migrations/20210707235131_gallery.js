
exports.up = function(knex) {
    return knex.schema.createTable("gallery", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();

        table.text("image_url", "longtext").notNullable();
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("gallery");
};
