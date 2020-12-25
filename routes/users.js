const express = require("express");
const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const auth = require("../config/auth");
const connection = require("../config/mysqlConnection");


const router = express.Router();




// User List
router.get("/", auth, (req, res) => {
    console.log(req.user);

    connection.query("select * from users", (err, users) => {

        if(err) throw err;

        res.render("user-list", {users});
    });
    
});



// Adding New User
router.post("/add-user", (req, res) => {
    
    //console.log(req.body);

    let {first_name, last_name, username, designation, password} = req.body;
    //console.log(username);


    let user_id;
    connection.query("select * from users where username = ?", [username], (err, user) => {

        if(err) throw err;
        
        // "select * from users where username = ?" query will return an array so to check whether
        // a user exists or not we need to check for returned arrays length. If length is true (not 0) then
        // that means user exists.
        if(user.length) {
            res.render("error");
        } else {
            connection.query("select * from users", (err, users) => {
                users.forEach(user => {
                    user_id = user.user_id + 1;
                });
                console.log(user_id);

                bcrypt.genSalt(10, (err, salt) => {
                    if(err) throw err;

                    bcrypt.hash(password, salt, (err, hash) => {
                        if(err) throw err;

                        password = hash;

                        let sql = "insert into users values ?";
                        let values = [[user_id, first_name, last_name, username, designation, password, "active"]];

                        connection.query(sql, [values], err => {
                            if(err) throw err;

                            res.render("success");
                        });
                    });
                });

                
            });
        }
    });

    //res.redirect("/users");

});



router.post("/user-status", (req, res) => {
    let status = req.body.statusValue === "active" ? "inactive" : "active";

    connection.query(
        "UPDATE users SET status = " + mysql.escape(status) +  " WHERE user_id = " + mysql.escape(req.body.status), (err) => {

            if(err) throw err;
            res.redirect("/users");

    });

});



module.exports = router;




