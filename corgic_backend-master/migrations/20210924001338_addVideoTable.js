
exports.up = function(knex) {
    return knex.schema.createTable("gospel_videos", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.string("title", 512);
        table.string("description", 512);
        table.text("thumbnail", "longtext").notNullable();
        table.text("video_url", "longtext").notNullable();
        table.timestamps(false, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("gospel_videos");
};
