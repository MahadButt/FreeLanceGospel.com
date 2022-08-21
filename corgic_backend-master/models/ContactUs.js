const { Model } = require("objection");

class ContactUs extends Model {

    static get tableName() {
        return "contact_us";
    }

    static get idColumn() {
        return "id";
    }

    $beforeUpdate() {
        this.updated_at = require("moment")().format("YYYY-MM-DD HH:mm:ss");
    }
}

module.exports = ContactUs;