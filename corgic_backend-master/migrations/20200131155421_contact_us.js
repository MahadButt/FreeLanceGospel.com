const { msgStatus } = require("../utils/consts");

exports.up = function(knex) {
    return knex.schema.createTable("contact_us", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        
        table.string("name", 75).notNullable();
        table.string("email", 255).notNullable();
        table.text("message", "mediumtext").notNullable();
        table.integer("status").defaultTo(msgStatus.UNREAD);

        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("contact_us");
};
