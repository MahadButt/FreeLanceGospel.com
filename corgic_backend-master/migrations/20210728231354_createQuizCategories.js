
exports.up = function (knex) {
    return knex.schema.createTable("quiz_categories", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.string("name", 512);
        table.integer("active").defaultTo(1);
        table.timestamps(false, true);
    }).table('quiz_questions', function (table) {
        table.integer("category_id").unsigned();
        table.foreign("category_id").references("id").inTable("quiz_categories").onDelete("CASCADE");
    }).table('quiz', function (table) {
        table.integer("category_id").unsigned();
        table.foreign("category_id").references("id").inTable("quiz_categories").onDelete("CASCADE");
    });
};

exports.down = function (knex) {
    return knex.schema.table('quiz_questions', function (table) {
        table.dropForeign('category_id', 'quiz_questions_category_id_foreign')
        table.dropColumn('category_id')
    }).table('quiz', function (table) {
        table.dropForeign('category_id', 'quiz_category_id_foreign')
        table.dropColumn('category_id')
    }).dropTable("quiz_categories");
};
