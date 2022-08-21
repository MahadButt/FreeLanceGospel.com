
require("dotenv").config();

module.exports = {

	development: {
		client: "mysql",
		connection: {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		},
		debug: true,
		pool: { min: 5, max: 10 }
	},
	
	testing: {
		client: "mysql",
		connection: {
			host: process.env.DB_HOST_TEST,
			user: process.env.DB_USER_TEST,
			password: process.env.DB_PASS_TEST,
			database: process.env.DB_NAME_TEST
		},
		debug: true
	},

	production: {
		client: "mysql",
		connection: {
			host: process.env.DB_HOST_PROD,
			user: process.env.DB_USER_PROD,
			password: process.env.DB_PASS_PROD,
			database: process.env.DB_NAME_PROD
		}
	}
}