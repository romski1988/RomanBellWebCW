const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const User = require('../models/User');
const Count = require('../models/Count');

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

// delete routes
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
        })
});

// voting route
router.get('/increase/:type', (req, res) => {
    var query = req.params.type;
    let searchQuery = {carType: query}

    Count.findOne(searchQuery)
    .then(car=>{
        if(!car){
            console.log('shit')
            car = Count.create({carType: query, clickCount: 1});
            car.save()
        }
        else{
            console.log(car)
            var newCount = car.clickCount + 1;
            var nCarType = car.carType;
            var car_id = car._id;
            console.log(newCount);
            Count.findByIdAndUpdate(car_id, {clickCount: newCount}, (error, data) =>{
                if(error){
                    console.log(error)
                }
                else{
                    console.log(data)
                }
            }
            )
            req.flash('success_msg', 'Thanks for voting')
        }
    })
    .catch(err=>{
        req.flash('error_msg', 'ERROR: ' + err)
    })
})


// Dashboard page
// router.get('/dashboard', ensureAuthenticated, (req, res) => 

//     res.render('dashboard', {
//         username: req.user.username})
//     );
  
module.exports = router;