
const { blogHighlight, blogStatus } = require("../utils/consts");

exports.up = function(knex) {
    return knex.schema.createTable("blog", table => {
        table.collate("utf8mb4_unicode_ci");
        table.increments("id").primary();
        table.integer("u_id").unsigned();

        table.string("title", 512).notNullable();
        table.string("sub_title", 255);
        table.text("description", "longtext").notNullable();
        table.text("banner_img_url", "longtext").notNullable();
        table.text("preview_url", "longtext").notNullable();
        table.integer("cat_id").unsigned();
        table.integer("subcat_id").unsigned();
        table.integer("highlight").defaultTo(blogHighlight.NOT_HIGHLIGHT);
        table.integer("status").defaultTo(blogStatus.PENDING);

        table.foreign("u_id").references("u_id").inTable("users").onDelete("CASCADE");
        table.foreign("cat_id").references("id").inTable("blog_cat").onDelete("SET NULL");
        table.foreign("subcat_id").references("id").inTable("blog_subcat").onDelete("SET NULL");
        
        table.timestamps(false, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("blog");
};