
exports.up = function(knex) {
    return knex.schema.createTable("quiz", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        
        table.integer("quiz_id").unsigned().notNullable();
        table.integer("u_id").unsigned().notNullable();
        table.integer("total_questions").unsigned().notNullable();
        table.integer("correct_answers").unsigned().notNullable();

        table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("quiz");
};
