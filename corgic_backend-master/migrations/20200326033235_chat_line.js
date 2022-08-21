
exports.up = function(knex) {
    return knex.schema.createTable("chat_line", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        
        table.integer("channel_id").unsigned();
        table.integer("u_id").unsigned();
        table.text("line_text", "longtext").notNullable();

        table.foreign("channel_id").references("id").inTable("chat_channel").onDelete("CASCADE");
        table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("chat_line");
};