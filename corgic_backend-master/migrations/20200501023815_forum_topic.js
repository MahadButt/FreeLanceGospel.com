exports.up = function(knex) {
    return knex.schema.createTable("forum_topic", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        
        table.string("topic_name", 255);
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("forum_topic");
};