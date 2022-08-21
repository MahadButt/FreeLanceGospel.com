
exports.up = function(knex) {
    return knex.schema.createTable("roles", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("role_id").primary();
        table.string("role_name", 45).notNullable();
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("roles");
};