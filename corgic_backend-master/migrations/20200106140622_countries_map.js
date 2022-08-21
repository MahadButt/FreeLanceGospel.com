
exports.up = function(knex) {
    return knex.schema.createTable("countries_map", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.string("country_code", 2).notNullable();
        table.string("country_name", 100).notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("countries_map");
};