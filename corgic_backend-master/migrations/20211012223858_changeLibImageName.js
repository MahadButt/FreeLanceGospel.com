
exports.up = function (knex) {
    return knex.schema.table('library_images', function (table) {
            table.renameColumn('image_url',"document_url")
        }).raw('ALTER TABLE `library_images` RENAME TO `library_documents`');
};

exports.down = function (knex) {

};
