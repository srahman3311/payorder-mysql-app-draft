const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs"); // Needed For User Password Checking
const connection = require("./mysqlConnection");





module.exports = function(passport) {
    passport.use(
        new LocalStrategy((username, password, done) => {

            connection.query("select * from users where username = ?", [username], (err, result) => {
                if(err) return done(err);

                if(!result.length) {
                    return done(null, false, {message: "this user is not registered"});
                }

                let user = result[0];

                if(user.status !== "active") {
                    return done(null, false, {message: "this user is not active and hence denied access"});
                }

                // Match Password
                bcrypt.compare(password, user.password, (err, isMatch) => {

                    if(err) throw err;

                    if(isMatch) {

                        return done(null, user);

                    } else {

                        return done(null, false, {message: "Passwords don't match"});
                    }
                   
                });
            });
            
        })
    );

    passport.serializeUser((user, done) => {

        done(null, user.user_id);

    });
      
    passport.deserializeUser((id, done) => {

        connection.query("select * from users where user_id = ?", [id], (err, result) => {
            
            let user = result[0];
            done(err, user);
          
        });
    });
};
