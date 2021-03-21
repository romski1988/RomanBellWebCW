const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const User = require('../models/User');

// Wellcome page
router.get('/', (req, res) => res.render('welcome'));

//get routes starts here
router.get('/dashboard', ensureAuthenticated, (req, res)=> {
    User.find({})
        .then(users => {
            res.render('dashboard', {users : users, username: req.user.username});
        })
        .catch(err=> {
             req.flash('error_msg', 'ERROR: '+err)
             res.redirect('/');
        })
    
});

//delete routes starts here
router.get('/delete/:id',  (req, res) =>{
    var query = req.params.id;
    let searchQuery = {_id: query};

    User.deleteOne(searchQuery)
        .then(users=>{
            req.flash('success_msg', 'Users deleted successfully.')
            res.redirect('/dashboard');
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err)
            res.redirect('/dashboard');
        });
})

// Dashboard page
// router.get('/dashboard', ensureAuthenticated, (req, res) => 

//     res.render('dashboard', {
//         username: req.user.username})
//     );
  
module.exports = router;