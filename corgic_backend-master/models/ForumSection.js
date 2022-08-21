const { Model } = require("objection");

class ForumSection extends Model {

    static get tableName() {
        return "forum_section";
    }

    static get idColumn() {
        return "id";
    }

    $beforeUpdate() {
        this.updated_at = require("moment")().format("YYYY-MM-DD HH:mm:ss");
    }
}

module.exports = ForumSection;