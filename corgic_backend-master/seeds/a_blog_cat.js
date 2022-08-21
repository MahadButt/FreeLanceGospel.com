
exports.seed = function (knex) {
	return knex("blog_cat").del()
		.then(function () {
			return knex("blog_cat").insert([
				{ category_name: "Religion" },
				{ category_name: "GOD" },
                { category_name: "COGIC History" },
				{ category_name: "Others" },
			]);
		});
};
