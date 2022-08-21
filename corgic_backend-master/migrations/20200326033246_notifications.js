const { notificationRead } = require("../utils/consts");

exports.up = function(knex) {
    return knex.schema.createTable("notifications", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        
        table.integer("u_id").unsigned();
        table.integer("notification_type").notNullable();
        table.string("body", 255).notNullable();
        table.string("url", 255);
        table.boolean("is_read").defaultTo(notificationRead.UNREAD);

        table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("notifications");
};