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
    var locations = db.collection('locations');

    this.search = function (req, res) {
        var location = req.query.location;
        yelp.search({term: 'bar', location: location})
            .then(function (data) {
                res.json(data.businesses);
            })
            .catch(function (err) {
                res.json(err);
            });
    };

    this.going = function (req, res) {
        var locationId = req.query.locationId;
        console.log(req.user);
        console.log(req.isAuthenticated());
        if (req.isAuthenticated()) {
            locations.insertOne({
                locationId: locationId,
                userId: req.user._id
            }, function (err, result) {
                if (err) res.json(err);
                console.log(result);
                res.json({count: 1});
            });
        } else {
            res.json({count: 0});
        }
    }
}

module.exports = MainController;