const { Model } = require("objection");

class Gallery extends Model{
    static get tableName() {
        return "gallery";
    }

    static get idColumn() {
        return "id";
    }
    
    $beforeUpdate() {
        this.updated_at = require("moment")().format("YYYY-MM-DD HH:mm:ss");
    }
}

module.exports = Gallery;