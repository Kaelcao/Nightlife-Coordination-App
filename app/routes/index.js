'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var MainController = require('../controllers/mainController.server');

module.exports = function (app, db) {

    var clickHandler = new ClickHandler(db);
    var mainController = new MainController(db);

    app.route('/')
        .get(function (req, res) {
            res.sendFile(path + '/public/index.html');
        });
    app.get('/api/search',mainController.search);
    app.route('/api/users')
        .get(clickHandler.getClicks)
        .post(clickHandler.addClick)
        .delete(clickHandler.resetClicks);
};
