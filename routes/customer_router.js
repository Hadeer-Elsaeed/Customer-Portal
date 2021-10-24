const { request, response } = require("express");
const express = require("express");
const session = require("express-session");
let customerRouter = express.Router();
const connection = require("../db/connect_db");

// list all customers
customerRouter.get("/customers", (request, response) => {
    let user_email = request.session.email
    let last_login = request.session.last_login
    let name = request.session.name
    connection.query(
        'SELECT * FROM users WHERE email ="' + user_email + '"',
        function (err, result) {
            if (err) {
                response.send(err);
            }
            if (!result[0]) {
                response.send(" you should be logged in to list customers");
            } else {
                let user_id = result[0].id
                connection.query(
                    'SELECT * FROM customers WHERE user_id ="' + user_id + '"',
                    function (err, result) {
                        if (err) throw err;
                        response.render('customers/list_customers', {'customers': result, 'last_login': last_login, 'name': name})
                    });
                }
    })

});

customerRouter.get("/add_customer", (request, response)=>{
    let last_login = request.session.last_login
    let name = request.session.name
    response.render("customers/add_customer", {"name": name, "last_login": last_login})
})

customerRouter.post("/add_customer", (request, response) => {
    let user_email = request.session.email
    let name = request.body.name
    let title = request.body.title
    let description = request.body.description
    connection.query(
        'SELECT * FROM users WHERE email ="' + user_email + '"',
        function (err, result) {
            if (err) {
                response.send(err);
            }
            if (!result[0]) {
                response.send(" you should be logged in to add customers");
            } else {
                let user_id = result[0].id
                connection.query(
                    "INSERT INTO customers (name, title, description, user_id) VALUES ('" +
                    name +
                    "', '" +
                    title +
                    "', '" +
                    description +
                    "', '" + user_id + "')",
                    (err, rows) => {
                        if (err) throw err;
                        response.redirect("/customers");
                    }
                );
            }
        }
    );



});

// list customer information
customerRouter.get("/customer/:id", (request, response) => {
    let user_email = request.session.email
    let last_login = request.session.last_login
    let name = request.session.name
    connection.query(
        'SELECT * FROM users WHERE email ="' + user_email + '"',
        function (err, result) {
            if (err) {
                response.send(err);
            }
            if (!result[0]) {
                response.send(" you should be logged in to list customers");
            } else {
                let id = request.params.id
                connection.query(
                    'SELECT * FROM customers WHERE id ="' + id + '"',
                    function (err, output) {
                        if (err) throw err;
                        response.render("customers/customer_details", {"customer": output[0], "name":name,"last_login": last_login})
                    });
            }
        })
});

customerRouter.delete("/customer/:id", (request, response) => {
    let user_email = request.session.email
    connection.query(
        'SELECT * FROM users WHERE email ="' + user_email + '"',
        function (err, result) {
            if (err) {
                response.send(err);
            }
            if (!result[0]) {
                response.send(" you should be logged in to list customers");
            } else {
                let id = request.params.id
                connection.query(
                    'DELETE FROM customers WHERE id = "'+id+'"',
                    function (err, output) {
                        if (err) throw err;
                        response.send('customer is deleted successfully')
                    });
            }
        })
});


module.exports = customerRouter;