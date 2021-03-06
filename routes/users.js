const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User and Car Model
const User = require('../models/User');
const Count = require('../models/Count');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// User Management Page
//router.get('/userMan', (req, res) => res.render('userMan'));

// User AB Test Page
//router.get('/abTest', (req, res) => res.render('abTest'));
router.get('/abTest', (req, res) => {
    var query = {};
    Count.find(query).select('carType clickCount')
    .then(counts => {
        var classicCount = 0;
        var modernCount = 0;
        for(var i=0; i<counts.length; i++){
            if(counts[i].carType == 'classicCar'){
                classicCount = counts[i].clickCount;
            }
            if(counts[i].carType == 'modernCar'){
                modernCount = counts[i].clickCount;
            }
        }
        res.render('abTest', {modernCount: modernCount, classicCount: classicCount })})
    .catch(err=>{
        console.log(err);
    });
});


// Register Handler
router.post('/register', (req, res) => {
    const { username, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if(!username || !email || !password || !password2){
        errors.push({ msg: 'All Fields must be filled' });
    }
    if(password !== password2){
        errors.push({ msg: 'Password do not match'});
    }
    if(password.length < 6){
        errors.push({ msg: 'Password must be longer than 6 characters'});
    }
    if(errors.length > 0){
        res.render('register', {
            errors,
            username,
            email,
            password,
            password2
        });
    } else{
        // Validation passed
        User.findOne({ username: username }).then(user => {
            if(user){
                // User in DB
                errors.push({ msg: 'Username is already used'});
                res.render('register', {
                    errors,
                    username,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    username,
                    email,
                    password
                });
                
                // Hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    // Save the user
                    newUser.save().then(user => {
                        req.flash('success_msg', 'New User Registered');
                        res.redirect('/users/login');
                    }).catch(err => console.log(err));
                }))
            }
        });
    }
});

// Login Handler
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Handler
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged out of Your Account');
    res.redirect('/users/login');
});

// Export Router
module.exports = router;