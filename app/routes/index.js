'use strict';

var path = process.cwd();
var MainController = require('../controllers/mainController.server');

module.exports = function (app, db, passport) {

    var mainController = new MainController(db);

    app.route('/')
        .get(function (req, res) {
            res.sendFile(path + '/public/index.html');
        });

    app.get('/logout', function (req, res) {
        res.redirect('/');
    });

    app.get('/api/search', mainController.search);
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {failureRedirect: '/#login'}),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });
    app.get('/test', function (req, res) {
        // console.log(req.isAuthenticated());
        res.send('done');
    });
    app.get('/api/going', mainController.going);
};
