require("dotenv").config();
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const connection = require("./config/mysqlConnection");


const app = express();

// Authentiction Middleware
require("./config/passport")(passport);



// View Engine
app.set("view engine", "ejs");


// Static Files Rendering
app.use(express.static(__dirname + "/public/"));


// Body Parser
app.use(express.urlencoded({extended: true}));


// Session
app.use(session({
    secret: 'ubaidrahman',
    resave: false,
    saveUninitialized: true,
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());




// Database Connection
connection.connect(err => {
    if (err) throw err;
    console.log("mysql database connected");
});



// Creating Table

/*
const sql = "create table users(user_id INT, first_name char(50), last_name char(50), username char(50), designation char(50), password char(100), status char(50), primary key(user_id))";

connection.query(sql, err => {
    if(err) throw err;

    console.log("table created");
});
*/


// Inserting a user

/*
let password = "superboss123";

bcrypt.genSalt(10, (err, salt) => {
    if(err) throw err;

    bcrypt.hash(password, salt, (err, hash) => {

        if(err) throw err;
        password = hash;


        const sql = "insert into users values ?";
        const values = [[1001, 'Zillur', 'Rahman', 'super-boss123', 'Managing Director', password, 'active']];


        connection.query(sql, [values], err => {
            if(err) throw err;

            console.log("values inserted");
        });
    });

});
*/





/*

let sql = "insert into payorders values ?";
let values = [
    [1095, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, 'not released', 'pending', 'added'],
    [1096, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, 'not released', 'pending', 'added'],
    [1097, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1098, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1099, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1100, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1101, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1102, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1103, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1104, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1105, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1106, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1107, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1108, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1109, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1110, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1111, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1112, '2020-12-25', 'tube2021', 'sonali', 'motijheel', 'fahim', 2825.20, "not released", "pending", 'added'],
    [1113, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1114, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1115, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1116, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1117, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1118, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1119, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1120, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1121, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1122, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1123, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1124, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1125, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1126, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1127, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1128, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1129, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1130, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1131, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1132, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1133, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1134, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],
    [1135, '2020-12-25', 'gan2022', 'dipali', 'mirpur', 'anisha', 2825.20, 'not released', 'pending', 'added'],


];

connection.query(sql, [values], (err, result) => {
    if(err) throw err;
    console.log("one row added");
});


// returns a new date 2020-12-15 in this format and stores in today variable
let today = new Date('2020-12-15');

// storing matched payorders from database query in new array
let matchedPayorders = [];

for(let i = 0; i < 50; i++) {

    // converts the date + 24 hours in milliseconds
    today = today.getTime() + 86400000;

    // returns the new date after adding 24 hours to it. but returned date is one month less than expected and hence need
    // to add 1 with month to get the desired date. 
    let day = new Date(today);


    let year = day.getFullYear().toString(); // returns the year
    let month = (day.getMonth() + 1).toString(); // returns the month
    let date = day.getDate().toString(); // returns the date
    
    let x = `${year}-${month}-${date}`; // turns the year, month, date to a format that matches with database record
    

    
    connection.query("select * from payorders where date_time = " + mysql.escape(x) , (err, result) => {
        if(err) throw err;
        //console.log(result);

        if(result.length !== 0) {

            result.forEach(item => {
                console.log(item.serial_no);
            });
            //console.log(result[0].serial_no);
        }
    });
    
    today = new Date(x);
}

*/



// Routes
app.use("/", require("./routes/routes"));
app.use("/users", require("./routes/users"));





// Select everything from a table. Individual js objects will be created with each row data. results is an 
// array of object with column heading as each object property
/*
connection.query("SELECT * FROM users", (err, results) => {
    if(err) throw err;
    //console.log(results);

    results.forEach(x => console.log(x.first_name));
});
*/



// Select specific columns. Individual js objects will be created from each row taking just the 
// first_name and password information and setting them as object property
/*
connection.query("SELECT first_name, password FROM users", (err, results) => {
    if(err) throw err;
    //console.log(results);

    //results.forEach(x => console.log(x.first_name));
});
*/









// Select from where
// To be able to use variable name in query mysql.escape(variable_name) method must be used to avoid sql injection
// Other way of using variable name is to use ? sign after query

// mysql.escape(variable_name) example
/*
let x = "anisha";
connection.query("SELECT * FROM users WHERE first_name = " + mysql.escape(x), (err, results) => {
    if(err) throw err;
    console.log(results);

    //results.forEach(x => console.log(x.first_name));
});
*/



// use of ? sign after query example
/*
let x = "anisha";
connection.query("SELECT * FROM users WHERE first_name = ?", [x], (err, results) => {
    if(err) throw err;
    console.log(results);

    //results.forEach(x => console.log(x.first_name));
});
*/



// Inserting row
/*
let sql = "INSERT INTO users (id, first_name, last_name, password) VALUES (8, 'ABC', 'RAHMAN', 'abc123')";
connection.query(sql, err => {
    if(err) throw err;
    console.log('one row inserted successfully');

    //results.forEach(x => console.log(x.first_name));
});
*/





























const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server started on port ${PORT}`));