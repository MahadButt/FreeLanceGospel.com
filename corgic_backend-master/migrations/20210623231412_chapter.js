
exports.up = function (knex) {
    return knex.schema
        .createTable("chapter", table => {
            table.collate("utf8mb4_unicode_ci");
            table.increments("id").primary();
            table.integer("u_id").unsigned().notNullable();

            table.string("title", 512).notNullable();
            table.text("description", "longtext");
            table.integer("active").defaultTo(1);

            table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");

            table.timestamps(false, true);
        }).table('blog', function (table) {
            table.integer("chapter_id").unsigned();
            table.foreign("chapter_id").references("id").inTable("chapter").onDelete("CASCADE");
        });
};

exports.down = function (knex) {
    return knex.schema.table('blog', function(table) {
        table.dropForeign('chapter_id','blog_chapter_id_foreign')
        table.dropColumn('chapter_id')
      }).dropTable("chapter");
};