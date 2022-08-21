
exports.up = function(knex) {
    return knex.schema.createTable("user_images", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.integer("u_id").unsigned().notNullable();
        table.string("image_url").notNullable();
        table.boolean("is_header_image").defaultTo(false);

        table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("user_images");
};
