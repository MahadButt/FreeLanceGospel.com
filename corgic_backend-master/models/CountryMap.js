const { Model } = require("objection");

class CountryMap extends Model {

    static get tableName() {
        return "countries_map";
    }

    static get idColumn() {
        return "id";
    }

    $beforeUpdate() {
        this.updated_at = require("moment")().format("YYYY-MM-DD HH:mm:ss");
    }
}

module.exports = CountryMap;