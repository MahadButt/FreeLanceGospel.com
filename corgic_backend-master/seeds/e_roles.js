
exports.seed = function (knex) {
	return knex("roles").del()
		.then(function () {
			return knex("roles").insert([
                { role_name: "SYSOP" },
				{ role_name: "ADMIN" },
				{ role_name: "MODERATOR" },
				{ role_name: "USER" }
			]);
		});
};