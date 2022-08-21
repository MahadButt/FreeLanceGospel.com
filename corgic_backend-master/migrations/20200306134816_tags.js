
exports.up = function(knex) {
    return knex.schema.createTable("tags", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.string("tag_name", 255).notNullable();
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("tags");
};