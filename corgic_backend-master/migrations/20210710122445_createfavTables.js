
exports.up = function (knex) {
    return knex.schema.createTable("books", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.integer("u_id").unsigned().notNullable();
        table.string("title", 512).notNullable();
        table.text("description", "longtext");
        table.integer("active").defaultTo(1);
        table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.timestamps(false, true);
    }).createTable("movies", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.integer("u_id").unsigned().notNullable();
        table.string("title", 512).notNullable();
        table.text("description", "longtext");
        table.integer("active").defaultTo(1);
        table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.timestamps(false, true);
    }).createTable("musics", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.integer("u_id").unsigned().notNullable();
        table.string("title", 512).notNullable();
        table.text("description", "longtext");
        table.integer("active").defaultTo(1);
        table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.timestamps(false, true);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("books").dropTable("movies").dropTable("musics");
};
