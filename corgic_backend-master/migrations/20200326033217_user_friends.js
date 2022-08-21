const { friendReqStatus } = require("../utils/consts");

exports.up = function(knex) {
    return knex.schema.createTable("user_friends", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        
        table.integer("u_id").unsigned();
        table.integer("friend_id").unsigned();
        table.integer("status").notNullable().defaultTo(friendReqStatus.PENDING);

        table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.foreign("friend_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("user_friends");
};