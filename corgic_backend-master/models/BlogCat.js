const { Model } = require("objection");

const BlogSubCat = require("./BlogSubCat");

class BlogCat extends Model {

    static get tableName() {
        return "blog_cat";
    }

    static get idColumn() {
        return "id";
    }

    $beforeUpdate() {
        this.updated_at = require("moment")().format("YYYY-MM-DD HH:mm:ss");
    }

    static get relationMappings() {

        return {

            subCats: {
                relation: Model.HasManyRelation,
                modelClass: BlogSubCat,
                join: {
                    from: "blog_cat.id",
                    to: "blog_subcat.parent_id"
                }
            },
        }
    }
}

module.exports = BlogCat;