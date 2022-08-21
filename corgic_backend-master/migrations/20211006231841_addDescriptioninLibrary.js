
exports.up = function(knex) {
    return knex.schema.createTable("library_images", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.integer("lib_id").unsigned().notNullable();
        table.string("image_url", 512);
        table.foreign("lib_id").references("id").inTable("library").onDelete("CASCADE");
        table.timestamps(false, true);
    }).table('library', function (table) {
        table.longtext('description').defaultTo(null);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("library_images").table('library', function (table) {
        table.dropColumn('description')
    })
};
