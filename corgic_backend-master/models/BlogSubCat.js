const { Model } = require("objection");

class BlogSubCat extends Model {

    static get tableName() {
        return "blog_subcat";
    }

    static get idColumn() {
        return "id";
    }

    $beforeUpdate() {
        this.updated_at = require("moment")().format("YYYY-MM-DD HH:mm:ss");
    }
}

module.exports = BlogSubCat;