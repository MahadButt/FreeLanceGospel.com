
const Knex = require("knex");
const knexConfig = require("./knexfile");
const { Model } = require("objection");
const User = require("./models/User");
    
const knex = Knex(knexConfig["development"]);
Model.knex(knex);

(async function () {

    await Promise.all(
        Array(100).fill(1).map((_, index) => {
            return User
                .query()
                .insert({
                    first_name: "mushi",
                    last_name: `${index}`,
                    email: `mushi${index}@gmail.com`,
                    denomination: "COGIX",
                    church_title: "Bro",
                    password: "238123jhasdbasd",
                    avatar_url: "uploads/images/user.svg",
                    role_id: 4,
                    status: 1
                });
        })
    );

})();