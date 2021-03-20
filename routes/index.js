const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


// Wellcome page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) => 
    res.render('dashboard', {
        username: req.user.username
    }));
  
module.exports = router;