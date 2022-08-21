
exports.seed = function (knex) {
	return knex("forum_topic").del()
		.then(function () {
			return knex("forum_topic").insert([
                { topic_name: "Prayer Request" },
				{ topic_name: "General Discussion" },
				{ topic_name: "Queries" }
			]);
		});
};