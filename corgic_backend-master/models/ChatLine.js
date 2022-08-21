const { Model } = require("objection");

class ChatLine extends Model {

    static get tableName() {
        return "chat_line";
    }

    static get idColumn() {
        return "id";
    }

    $beforeUpdate() {
        this.updated_at = require("moment")().format("YYYY-MM-DD HH:mm:ss");
    }
}

module.exports = ChatLine;