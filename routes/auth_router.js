const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const connection = require("../db/connect_db");

authRouter.get("/login", (request, response) => {
	response.render("auth/login");
});

authRouter.post("/login", (request, response) => {
	connection.query(
		'SELECT * FROM users WHERE email ="' + request.body.email + '"',
		function (err, result) {
			if (err) {
				response.send(err);
			}
			if (!result[0]) {
				response.send("There is no account with this email");
			} else {
				bcrypt.compare(
					request.body.password,
					result[0].password,
					function (err, isMatch) {
						if (err) {
							throw err;
						} else if (!isMatch) {
							response.redirect("/login");
						} else {
							request.session.email = result[0].email
							request.session.last_login = result[0].last_login
							request.session.name = result[0].name
							process.env.TZ = 'Africa/Cairo'
							var today = new Date();
							var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
							var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
							var dateTime = date+' '+time;
							connection.query("UPDATE users SET last_login = '"+dateTime+"' WHERE email = '"+result[0].email+"'" ,
							(err, rows) => {
								response.redirect('/customers')
								// connection.end();
							}
						);
						}
					}
				);
			}
		}
	);
});

authRouter.get("/register", (request, response) => {
	response.render("auth/registeration");

});

authRouter.post("/register", (request, response) => {
	const name = request.body.name;
	const email = request.body.email;
	const saltRounds = 10;
	bcrypt.hash(request.body.password, saltRounds)
		.then((hash) => {
			connection.query(
				'SELECT email FROM users WHERE email ="' + email + '"',
				function (err, result) {
					if (err) {
						response.send(err);
					}
					//You will get an array. if no users found it will return.
					if (result[0] == undefined) {
						connection.query(
							"INSERT INTO users (name, email, password) VALUES ('" +
							name +
							"', '" +
							email +
							"', '" +
							hash +
							"')",
							(err, rows) => {
								console.log("The data from users table are: \n", rows);
								// connection.end();
							}
						);
						response.redirect("/login");
					} else {
						response.render("auth/registeration");
					}
				}
			);
		})
		.catch((err) => console.error(err.message));
});

authRouter.get("/logout", (request, response) => {
	request.session.destroy();
	response.redirect("/login");
});
module.exports = authRouter;
