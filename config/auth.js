const express = require("express");
const passport = require("passport");


function auth(req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/");
    }
}





module.exports = auth;