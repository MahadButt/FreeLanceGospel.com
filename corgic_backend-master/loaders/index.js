
const dotenv = require("dotenv");

const expressLoader = require("./express");
const loadDatabase = require("./database");

const crons = require("./crons")

const loader = (app) => {

    dotenv.config(); // load .env into process.env;
    
    loadDatabase();

    expressLoader(app);

    crons(app);
}

module.exports = loader;