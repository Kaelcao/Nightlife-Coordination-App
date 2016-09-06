'use strict';
var Yelp = require('yelp');

var yelp = new Yelp({
    consumer_key: 'ncn-KXRMcWnrgKOTlEtGUg',
    consumer_secret: 'nlomzxrdjhWijGfv-JTH1TcYaMs',
    token: '5QqZ9IfkcgwEwhsdOioSvrcI7hf-PrqV',
    token_secret: 'QP3DLr6-54aRgwf9cEvTWYpiZUI'
});

function MainController(db) {
    var users = db.collection('users');

    this.search = function (req, res) {
        var location = req.query.location;
        yelp.search({term: 'bar', location: location})
            .then(function (data) {
                res.json(data.businesses);
            })
            .catch(function (err) {
                res.json(err);
            });

    }
}

module.exports = MainController;