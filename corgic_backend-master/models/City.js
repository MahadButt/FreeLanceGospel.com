const { Model } = require("objection");

class City extends Model {

    static get tableName() {
        return "city";
    }

    static get idColumn() {
        return "id";
    }

    $beforeUpdate() {
        this.updated_at = require("moment")().format("YYYY-MM-DD HH:mm:ss");
    }
}

module.exports = City;