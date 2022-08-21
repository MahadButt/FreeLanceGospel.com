
exports.up = function(knex) {
    return knex.schema.createTable("users", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("u_id").primary();
        table.string("first_name", 45).notNullable();
        table.string("last_name", 45).notNullable();

        table.integer("country_id").unsigned();
        table.integer("marital_status");
        table.date("date_of_birth");
        table.text("address", "mediumtext");
        table.string("contact_no", 20).unique();
        table.string("email", 191).notNullable().unique();
        table.string("denomination", 255).notNullable();
        table.string("church_title", 255).notNullable();
        table.text("password", "longtext").notNullable();
        table.text("avatar_url", "medium_text");
        table.integer("status").notNullable();
        table.integer("role_id").unsigned();
        table.datetime("last_login");

        table.foreign("role_id").references("role_id").inTable("roles").onDelete("SET NULL");
        table.foreign("country_id").references("id").inTable("countries_map").onDelete("SET NULL");
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("users");
};
