
exports.up = function(knex) {
    return knex.schema.createTable("quiz_questions", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.text("question", "longtext");
        table.integer("active").defaultTo(1);
        table.timestamps(false, true);
    }).createTable("quiz_options", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.integer("question_id").unsigned().notNullable();
        table.text("option", "longtext");
        table.string("is_correct",512);
        table.integer("active").defaultTo(1);
        table.foreign("question_id").references("id").inTable("quiz_questions").onDelete("CASCADE");
        table.timestamps(false, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("quiz_options").dropTable("quiz_questions");
};
