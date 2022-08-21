
exports.up = function(knex) {
    return knex.schema.createTable("chat_channel", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        
        table.string("channel_name", 55).unique().notNullable();
        table.integer("u_1").unsigned();
        table.integer("u_2").unsigned();

        table.foreign("u_1").references("u_id").inTable("users").onDelete("CASCADE");
        table.foreign("u_2").references("u_id").inTable("users").onDelete("CASCADE");

        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("chat_channel");
};