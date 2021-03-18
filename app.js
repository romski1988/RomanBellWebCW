const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const flash = require('connect-flash');
const session = require('express-session');

require('dotenv').config();

const app = express();

// DB config
//const db = require('./config/keys').MongoURI;
const uri = process.env.PDB;
//console.log(uri);

// Connect to mongo
//const client = new MongoClient(db, { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log('Mongo DB is Connected...')).catch(err => console.log(err));
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Connected to Atlas Db');
}).catch((err) => {
    console.error('Error connecting to Db', err);
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session middleware
app.use(session({
    secret: 'sectret',
    resave: true,
    saveUninitialized: true
  }));

// Conhnect Flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});


// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {console.log(`Server listening on Port:${PORT}`)});