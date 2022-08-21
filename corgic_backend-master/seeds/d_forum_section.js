
exports.seed = function (knex) {
	return knex("forum_section").del()
		.then(function () {
			return knex("forum_section").insert([
                { topic_id: "1", section_name: "Request for Prayer", section_description: "Make your prayer requests here" },
                { topic_id: "2", section_name: "Introduce Yourself", section_description: "Here new people can give his/her introduction to others" },
                { topic_id: "2", section_name: "Movies & Shows", section_description: "Dedicated section for discussing about various Movies, Videos, Shows & TV series" },
                { topic_id: "3", section_name: "Site Issues", section_description: "Discuss about various queries or problems you face in this site" },
			]);
		});
};