const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const mysql = require("mysql");
const auth = require("../config/auth");
const connection = require("../config/mysqlConnection");
const { threadId } = require("../config/mysqlConnection");
const e = require("express");


const router = express.Router();




// Home route will prompt user to log in
router.get("/", (req, res) => {
    res.render("login");
});



//
router.post("/login", (req, res, next) => {
    passport.authenticate("local", 
    {
        successRedirect: "/dashboard", 
        failureRedirect: "/"
    }) (req, res, next);
});


router.get("/dashboard", auth, (req, res) => {
    //console.log(req.user);

    const viewLimit = 20;
    const offset = 0;

    connection.query("select * from payorders", (err, results) => {

        if(err) throw err;

        connection.query("SELECT * FROM payorders limit " + [viewLimit] + " offset " +  [offset], (err, payorders) => {
            if(err) throw err;
            res.render("dashboard", {payorders, user: req.user.username, offset, viewLimit, totalCount: results.length});
        });

    });

});


router.post("/dashboard", (req, res) => {
    
    // Rough


    // if post request is coming from viewLimit form
    if(typeof req.body.viewLimit !== "undefined" && typeof req.body.viewLimitForm !== "undefined") {

        const offset = 0;
        const viewLimit = Number(req.body.viewLimit);

        connection.query("select * from payorders", (err, results) => {

            if(err) throw err;
    
            connection.query("SELECT * FROM payorders limit " + [viewLimit] + " offset " +  [offset], (err, payorders) => {
                if(err) throw err;
                res.render("dashboard", {payorders, user: req.user.username, offset, viewLimit, totalCount: results.length});
            });
    
        });

    } 


    // else, post request is coming from somewhere else
    else {
   
    // check to see if post request is coming from either of the search boxes (text search and date search)
    //if(typeof req.body.searchValue !== "undefined" || req.body.start_date !== "" || req.body.end_date !== "") {
    if(typeof req.body.offset === "undefined") {

        const offset = 0;
        const viewLimit = Number(req.body.viewLimit);

        // if typeof req.body.searchValue !== "undefined" that means post request is coming from text search box
        if(typeof req.body.searchValue !== "undefined") {

            let searchText = req.body.searchValue;
            

            let sql = "select * from payorders where payorder_no LIKE '%" 
                        + [searchText] + "%' OR receiver_name LIKE '%" 
                        + [searchText] + "%' OR bank_name LIKE '%" + [searchText] + "%'";
            
            
            let sql2 = sql + " limit " + [viewLimit] + " offset " + [offset];

            connection.query(sql, (err, results) => {

                if(err) throw err;

                connection.query(sql2, (err, payorders) => {
                    res.render("dashboard", {payorders, user: req.user.username, offset, viewLimit, totalCount: results.length, searchText});
                });
                
            });
        }

        // if post request is not coming from text search box then it could be coming from date search box
        else {
            // if both of the date input fields are filled up and then request is made
            if(req.body.start_date !== "" && req.body.end_date !== "") {
                connection.query("select * from payorders", (err, results) => {

                    if(err) throw err;
            
                    let {start_date, end_date} = req.body;
                    //console.log(start_date, end_date);
            
                    // How many times should loop run is determined by difference in days
                    let date1 = new Date(start_date);
                    let date2 = new Date(end_date);
                    let diff = Math.abs(date1 - date2); // calculates the difference in miliseconds
                    diff = diff / (60*60*24*1000); // calculates the difference in days
            
            
                    // Converting start and end date to arrays to check if loop should run from start or end date.
                    // if user mistakenly put a back date in end date input then it will make sure that correct 
                    // records are pulled from database in correct order
                    let startDateArray = start_date.split("-");
                    let endDateArray = end_date.split("-");
            
                    let searchStartDate = start_date;
            
                    if(
                        Number(startDateArray[0]) - Number(endDateArray[0]) > 0 || 
                        Number(startDateArray[1]) - Number(endDateArray[1]) > 0 || 
                        Number(startDateArray[2]) - Number(endDateArray[2]) > 0 
                    ) { searchStartDate = end_date; }
            
            
                    let date = new Date(searchStartDate);
            
            
                    let newArray = [];
            
                    for(let i = 0; i <= diff; i++) {
            
                        // returns the new date after adding 24 hours to it. but returned date is one month less than expected and hence need
                        // to add 1 with month to get the desired date. 
                        let day = new Date(date);
            
            
                        let year = day.getFullYear().toString(); // returns the year
                        let month = (day.getMonth() + 1).toString(); // returns the month
                        let days = day.getDate().toString(); // returns the date
                        
                        let x = `${year}-${month}-${days}`; // turns the year, month, date to a format that matches with database record
            
                        results.forEach(result => {
                            if(result.date_time === x) {
                                newArray.push(result);
                            }
                        });
            
                        date = new Date(x);
                        // converts the date + 24 hours in milliseconds
                        date = date.getTime() + 86400000;
            
                    }
            
                    if(newArray.length > viewLimit) {
                        let payorders = [];
            
                        for(let p = 0; p < newArray.length; p++) {
                            if(p > viewLimit) {
                                break;
                            }
            
                            payorders.push(newArray[p]);
                        }
            
                        res.render("dashboard", { payorders, user: req.user.username, offset, viewLimit, totalCount: newArray.length, start_date, end_date });
                    } else {
                        res.render("dashboard", { payorders: newArray, user: req.user.username, offset, viewLimit, totalCount: newArray.length, start_date, end_date })
                    }
            
                    
                    
                });
            } 

            // else redirect to dashboard
            else {
                res.redirect("/dashboard");
            }
        }

    }

    // else post request is coming from pagination
    else {

        const viewLimit = Number(req.body.viewLimit);
        const offset = Number(req.body.offset);

        // if dashboard is populated with either text searched items or date searched items and the items' count 
        // is more than pagination limit
        if(req.body.searchedText !== "" || req.body.start_date !== "") {

            // if post dashboard is populated with text searched data
            if(req.body.searchedText !== "") {

                let searchText = req.body.searchedText;

                let sql = "select * from payorders where payorder_no LIKE '%" 
                    + [searchText] + "%' OR receiver_name LIKE '%" 
                    + [searchText] + "%' OR bank_name LIKE '%" + [searchText] + "%'";

                let sql2 = sql + " limit " + [viewLimit] + " offset " + [offset];

                connection.query(sql, (err, results) => {

                    if(err) throw err;

                    connection.query(sql2, (err, payorders) => {
                        res.render("dashboard", {payorders, user: req.user.username, offset, viewLimit, totalCount: results.length, searchText});
                    });
                    
                });
            }

            // else dashboard is populated with date searched data
            else {

                console.log(offset);
                connection.query("select * from payorders", (err, results) => {

                    if(err) throw err;
            
                    let {start_date, end_date} = req.body;
                    //console.log(start_date, end_date);
            
                    // How many times should loop run is determined by difference in days
                    let date1 = new Date(start_date);
                    let date2 = new Date(end_date);
                    let diff = Math.abs(date1 - date2); // calculates the difference in miliseconds
                    diff = diff / (60*60*24*1000); // calculates the difference in days
            
            
                    // Converting start and end date to arrays to check if loop should run from start or end date.
                    // if user mistakenly put a back date in end date input then it will make sure that correct 
                    // records are pulled from database in correct order
                    let startDateArray = start_date.split("-");
                    let endDateArray = end_date.split("-");
            
                    let searchStartDate = start_date;
            
                    if(
                        Number(startDateArray[0]) - Number(endDateArray[0]) > 0 || 
                        Number(startDateArray[1]) - Number(endDateArray[1]) > 0 || 
                        Number(startDateArray[2]) - Number(endDateArray[2]) > 0 
                    ) { searchStartDate = end_date; }
            
            
                    let date = new Date(searchStartDate);
            
            
                    let newArray = [];
            
                    for(let i = 0; i <= diff; i++) {
            
                        // returns the new date after adding 24 hours to it. but returned date is one month less than expected and hence need
                        // to add 1 with month to get the desired date. 
                        let day = new Date(date);
            
            
                        let year = day.getFullYear().toString(); // returns the year
                        let month = (day.getMonth() + 1).toString(); // returns the month
                        let days = day.getDate().toString(); // returns the date
                        
                        let x = `${year}-${month}-${days}`; // turns the year, month, date to a format that matches with database record
            
                        results.forEach(result => {
                            if(result.date_time === x) {
                                newArray.push(result);
                            }
                        });
            
                        date = new Date(x);
                        // converts the date + 24 hours in milliseconds
                        date = date.getTime() + 86400000;
            
                    }
            
                    if(newArray.length > offset) {
                        let payorders = [];
            
                        for(let p = offset + 1; p < newArray.length; p++) {
                            if(p > offset + viewLimit) {
                                break;
                            }
            
                            payorders.push(newArray[p]);
                        }
            
                        res.render("dashboard", { payorders, user: req.user.username, offset, viewLimit, totalCount: newArray.length, start_date, end_date });
                    } else {
                        res.render("dashboard", { payorders: newArray, user: req.user.username, offset, viewLimit, totalCount: newArray.length, start_date, end_date })
                    }
            
                    
                    
                });


            }

            
        } 
        
        // else dashboard is populated with all data
        else {
            console.log(offset);

            connection.query("select * from payorders", (err, results) => {

                if(err) throw err;
    
                connection.query("SELECT * FROM payorders limit " + [viewLimit] + " offset " +  [offset], (err, payorders) => {
                    if(err) throw err;
                    res.render("dashboard", {payorders, user: req.user.username, offset, viewLimit, totalCount: results.length});
                });
    
            });
        }
    }
}
    // Rough

    
    































    /*

    // if post request is coming from search boxe
    if(typeof req.body.searchValue !== "undefined") {

        let searchText = req.body.searchValue;
        let offset;

        if(typeof req.body.offset !== 'undefined') {
            offset = req.body.offset;
        } else {
            offset = 0;
        }

        let sql = "select * from payorders where payorder_no LIKE '%" 
                    + [searchText] + "%' OR receiver_name LIKE '%" 
                    + [searchText] + "%' OR bank_name LIKE '%" + [searchText] + "%'";
        
        let sql2 = "select * from payorders where payorder_no LIKE '%" 
                    + [searchText] + "%' OR receiver_name LIKE '%" 
                    + [searchText] + "%' OR bank_name LIKE '%" + [searchText] + "%' limit 10 offset " + [offset];

        connection.query(sql, (err, results) => {

            if(err) throw err;

            connection.query(sql2, (err, payorders) => {
                res.render("dashboard", {payorders, user: req.user.username, offset, totalCount: results.length, searchText});
            });
            
        });
    } 
    
    // if post request is coming from next/previous form 
    else {

        const offset = Number(req.body.offset);

        if(typeof req.body.searchedText !== "undefined") {

            let searchText = req.body.searchedText;

            let sql = "select * from payorders where payorder_no LIKE '%" 
                    + [searchText] + "%' OR receiver_name LIKE '%" 
                    + [searchText] + "%' OR bank_name LIKE '%" + [searchText] + "%'";
        
            let sql2 = "select * from payorders where payorder_no LIKE '%" 
                        + [searchText] + "%' OR receiver_name LIKE '%" 
                        + [searchText] + "%' OR bank_name LIKE '%" + [searchText] + "%' limit 10 offset " + [offset];

            connection.query(sql, (err, results) => {

                if(err) throw err;

                connection.query(sql2, (err, payorders) => {
                    res.render("dashboard", {payorders, user: req.user.username, offset, totalCount: results.length, searchText});
                });
                
            });
        } else {

            connection.query("select * from payorders", (err, results) => {

                if(err) throw err;
    
                connection.query("SELECT * FROM payorders limit 10 offset " +  [offset], (err, payorders) => {
                    if(err) throw err;
                    res.render("dashboard", {payorders, user: req.user.username, offset, totalCount: results.length});
                });
    
            });
        }
        
    }

    */


    /*
    const offset = Number(req.body.offset);

   

    connection.query("select * from payorders", (err, results) => {

        if(err) throw err;

        connection.query("SELECT * FROM payorders limit 10 offset " +  [offset], (err, payorders) => {
            if(err) throw err;
            res.render("dashboard", {payorders, user: req.user.username, offset, totalCount: results.length});
        });

    });
    */

});



/*
router.post("/payorder-search", (req, res) => {
    let searchText = req.body.searchValue;
    let offset = 0;

    let sql = "select * from payorders where payorder_no LIKE '%" 
                  + [searchText] + "%' OR receiver_name LIKE '%" 
                  + [searchText] + "%' OR bank_name LIKE '%" + [searchText] + "%'"

    connection.query(sql, (err, payorders) => {

        if(err) throw err;
        res.render("dashboard", {payorders, user: req.user.username, offset, totalCount: payorders.length, searchText});
         
    });
    
});
*/






router.post("/add-payorder", (req, res) => {
    //console.log(req.body);

    let {date_time, payorder_no, bank_name, branch_name, receiver_name, total_amount, remarks} = req.body;
    //total_amount = Number(total_amount);
    console.log("")
    let serial_no = 0;

    connection.query("select * from payorders", (err, results) => {

        if(err) throw err;

        if(!results.length) serial_no = 1001;

        results.forEach(result => serial_no = result.serial_no + 1);

        //console.log(serial_no);

        let sql = "insert into payorders values ?";
        let values = [[serial_no, date_time, payorder_no, bank_name, branch_name, receiver_name, total_amount, "not released", "pending", remarks]];

        connection.query(sql, [values], (err, result) => {
            if(err) throw err;
            console.log("one row added");
        });
    });

    

    //connection.query("insert into payorders values()")

    // connection.query("SELECT * FROM payorders", (err, results) => {
    //     if(err) throw err;
    //     //console.log(results);
    
    //     res.render("dashboard", {results: results, user: "rafez"});
    // });
    res.redirect("/dashboard");


});



router.post("/search-by-date", (req, res) => {


    connection.query("select * from payorders", (err, results) => {

        if(err) throw err;

        let {start_date, end_date} = req.body;
        //console.log(start_date, end_date);

        // How many times should loop run is determined by difference in days
        let date1 = new Date(start_date);
        let date2 = new Date(end_date);
        let diff = Math.abs(date1 - date2); // calculates the difference in miliseconds
        diff = diff / (60*60*24*1000); // calculates the difference in days


        // Converting start and end date to arrays to check if loop should run from start or end date.
        // if user mistakenly put a back date in end date input then it will make sure that correct 
        // records are pulled from database in correct order
        let startDateArray = start_date.split("-");
        let endDateArray = end_date.split("-");

        let searchStartDate = start_date;

        if(
            Number(startDateArray[0]) - Number(endDateArray[0]) > 0 || 
            Number(startDateArray[1]) - Number(endDateArray[1]) > 0 || 
            Number(startDateArray[2]) - Number(endDateArray[2]) > 0 
        ) { searchStartDate = end_date; }


        let date = new Date(searchStartDate);


        let newArray = [];

        for(let i = 0; i <= diff; i++) {

            // returns the new date after adding 24 hours to it. but returned date is one month less than expected and hence need
            // to add 1 with month to get the desired date. 
            let day = new Date(date);


            let year = day.getFullYear().toString(); // returns the year
            let month = (day.getMonth() + 1).toString(); // returns the month
            let days = day.getDate().toString(); // returns the date
            
            let x = `${year}-${month}-${days}`; // turns the year, month, date to a format that matches with database record

            results.forEach(result => {
                if(result.date_time === x) {
                    newArray.push(result);
                }
            });

            date = new Date(x);
            // converts the date + 24 hours in milliseconds
            date = date.getTime() + 86400000;

        }

        if(newArray.length > 10) {
            let payorders = [];

            for(let p = 0; p < newArray.length; p++) {
                if(p > 10) {
                    break;
                }

                payorders.push(newArray[p]);
            }

            res.render("dashboard", { payorders, user: req.user.username, offset: 0, totalCount: newArray.length, start_date, end_date });
        } else {
            res.render("dashboard", { payorders: newArray, user: req.user.username, offset: 0, totalCount: newArray.length, start_date, end_date })
        }

        
        
    });


   
    
    
});



router.post("/change-status", (req, res) => {

    let status = req.body.statusValue === "not released" ? "released" : "not released";
    console.log(status);

    connection.query(
        "UPDATE payorders SET status = " + mysql.escape(status) +  " WHERE payorder_no = " + mysql.escape(req.body.status), (err) => {

            if(err) throw err;
            res.redirect("/dashboard");

    });


    
    
});



router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});












module.exports = router;





