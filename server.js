'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongo = require('mongodb').MongoClient;
require('dotenv').config();
var app = express();

mongo.connect(process.env.MONGODB_URI, function (err, db) {

    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('MongoDB successfully connected.');
    }

    app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
    app.use('/public', express.static(process.cwd() + '/public'));

    routes(app, db);

    var port = 3000;
    app.listen(port, function () {
        console.log('Node.js listening on port ' + port + '...');
    });

});

