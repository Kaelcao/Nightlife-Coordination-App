var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function PassportConfig(db, passport) {
    var users = db.collection('users');

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        users.findOne({_id: id}, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new TwitterStrategy({
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: process.env.URL + '/auth/twitter/callback'
        },
        function (token, tokenSecret, profile, done) {
            users.findOne({_id: profile.id}, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(user);
                } else {
                    users.insertOne({_id: profile.id, profile: profile}, function (err, result) {
                        if (err) return done(err);
                        if (result.insertedCount == 1) {
                            return done({_id: profile.id, profile: profile})
                        } else {
                            console.log(result);
                        }
                    });
                }
            });
        }
    ));
}


