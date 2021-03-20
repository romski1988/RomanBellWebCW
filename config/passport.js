const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        // Changed from email to username
        new LocalStrategy({usernameField: 'username'}, (username, password, done) =>{
            // Match the user
            User.findOne({username: username }).then(user => {
                if(!user){
                    return done(null, false, {message: 'The username is not registered'});
                }
                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user);
                    }else{
                        return done(null, false, { message: 'Password is incorrect' })
                    }
                } );
            }).catch(err => console.log(err))
        })
    );
    
    // From Passportjs website
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}