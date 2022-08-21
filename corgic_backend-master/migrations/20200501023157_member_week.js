exports.up = function(knex) {
    return knex.schema.createTable("member_week", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        
        table.integer("u_id").unsigned();
        table.integer("status").defaultTo(1);

        table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("member_week");
};