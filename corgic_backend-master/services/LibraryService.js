
const logger = require("../loaders/logger");
const sharp = require("sharp");
const moment = require("moment");
const fs = require("fs");
const knex = require('knex')

const Library = require("../models/Library");


const libService = {
    getLibraryList: async function (query) {
        try {
            let library = null;
            let libCount = null;
            if (query.search_key && query.limit) {
                var dataLibCount = await Library.query().where('title', 'like', `%${query.search_key}%`).count("id as count");
                libCount = dataLibCount;
                var data = await Library.query().eager("documents").where('title', 'like', `%${query.search_key}%`).limit(parseInt(query.limit)).offset(parseInt(query.offset));
                library = data;
            } else {
                libCount = await Library.query().count("id as count");
                library = await Library.query().eager("documents").limit(parseInt(query.limit))
                    .offset(parseInt(query.offset));
            }
            return {
                library,
                count: libCount ? libCount[0].count : library.length
            };
        } catch (err) {
            logger.error(err)
        }
    },
    getLibById: async function (lib_id) {
        try {
            let lib = null;
            lib = await Library.query().eager("documents").findOne({ id: lib_id })
            return lib;
        } catch (err) {
            logger.error(err)
        }
    }
}

module.exports = libService;
