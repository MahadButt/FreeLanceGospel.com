exports.up = function(knex) {
    return knex.schema.createTable("library", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();

        table.text("title", "mediumtext").notNullable();
        table.text("document_url", "mediumtext").notNullable();

        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("library");
};