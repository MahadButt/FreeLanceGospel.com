exports.seed = function (knex) {
	return knex("blog_subcat").del()
		.then(function () {
			return knex("blog_subcat").insert([
                
				{ subcat_name: "SubCat1", parent_id: 1 },
				{ subcat_name: "SubCat2", parent_id: 1 },
				{ subcat_name: "SubCat3", parent_id: 1 },                
				
				{ subcat_name: "SubCat1", parent_id: 2 },
                { subcat_name: "SubCat2", parent_id: 2 },
				{ subcat_name: "SubCat3", parent_id: 2 },
                
				{ subcat_name: "SubCat1", parent_id: 3 },
                { subcat_name: "SubCat2", parent_id: 3 },
				{ subcat_name: "SubCat3", parent_id: 3 }
			]);
		});
};
