exports.up = function(knex) {
    return knex.schema.createTable("site_status", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();

        table.integer("status").notNullable();
        table.integer("active").notNullable();

        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("site_status");
};