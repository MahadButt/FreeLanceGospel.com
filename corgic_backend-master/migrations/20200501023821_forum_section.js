exports.up = function(knex) {
    return knex.schema.createTable("forum_section", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.integer("topic_id").unsigned();
        
        table.string("section_name", 255);
        table.string("section_description", 255);

        table.foreign("topic_id").references("id").inTable("forum_topic").onDelete("CASCADE");
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("forum_section");
};