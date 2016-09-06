'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongo = require('mongodb').MongoClient;
var passportConfig = require('./config/passport');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

require('dotenv').config();
var app = express();

mongo.connect(process.env.MONGODB_URI, function (err, db) {

    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('MongoDB successfully connected.');
    }
    var passport = passportConfig(db);

    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
    app.use('/public', express.static(process.cwd() + '/public'));

    // app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(session({
        secret: 'anything',
        resave: false,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    routes(app, db, passport);

    var port = process.env.PORT || 3000;
    app.listen(port, function () {
        console.log('Node.js listening on port ' + port + '...');
    });

});

