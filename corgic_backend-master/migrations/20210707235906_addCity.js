
exports.up = function(knex) {
    return knex.schema.createTable("city", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.string("name", 100).notNullable();
    }).table('users', function (table) {
        table.integer("city_id").unsigned();
        table.foreign("city_id").references("id").inTable("city").onDelete("CASCADE");
    });
};

exports.down = function(knex) {
    return knex.schema.table('users', function(table) {
        table.dropForeign('city_id','city_id_foreign')
        table.dropColumn('city_id')
      }).dropTable("city");
};