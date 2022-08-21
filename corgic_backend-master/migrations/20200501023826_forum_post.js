exports.up = function(knex) {
    return knex.schema.createTable("forum_post", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.integer("u_id").unsigned();
        table.integer("topic_id").unsigned();
        table.integer("section_id").unsigned();
        
        table.string("title", 255).notNullable();
        table.text("body", "longtext").notNullable();
        table.integer("views").defaultTo(0);

        table.foreign("u_id").references("u_id").inTable("users").onDelete("SET NULL");
        table.foreign("topic_id").references("id").inTable("forum_topic").onDelete("CASCADE");
        table.foreign("section_id").references("id").inTable("forum_section").onDelete("CASCADE");

        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("forum_post");
};