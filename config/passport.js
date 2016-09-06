var TwitterStrategy = require('passport-twitter').Strategy;
var passport = require('passport');

module.exports = function (db) {
    var users = db.collection('users');

    passport.use(new TwitterStrategy({
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: process.env.URL + '/auth/twitter/callback'
        },
        function (token, tokenSecret, profile, done) {
            users.findOne({socialId: profile.id}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                } else {
                    users.insertOne({
                        socialId: profile.id,
                        avatar: profile.photos[0].value,
                        username: profile.username
                    }, function (err, result) {
                        if (err) return done(err);
                        var user = result.ops[0];
                        return done(null, user);
                    });
                }
            });
        }
    ));
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        console.log("id: " + id);
        users.findOne({
            "_id": {
                "$in": [
                    {
                        '$oid': id
                    }
                ]
            }
        }, function (user) {
            console.log("deserial " + user);
            done(null, user);
        });
    });
    return passport;
};


