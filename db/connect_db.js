const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'db'
});


connection.connect(function(err) {
  if (err) throw err;
  console.log('Connected to MySQL Server!');

let createUsers = `create table if not exists users(
                          id int primary key auto_increment,
                          name varchar(255)not null,
                          email varchar(255)not null unique,
                          password varchar(255)not null,
                          last_login TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                      )`;

let createCustomers = `create table if not exists customers(
                        id int primary key auto_increment,
                        name varchar(255)not null unique,
                        title varchar(255)not null,
                        description varchar(255),
                        user_id int,
                        CONSTRAINT FK_UserCustomer FOREIGN KEY (user_id)
                        REFERENCES users(id)
                    )`;                      
  connection.query(createUsers, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

  connection.query(createCustomers, function(err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

  // connection.end(function(err) {
  //   if (err) {
  //     return console.log(err.message);
  //   }
  // });
});

module.exports = connection;