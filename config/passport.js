//this is where passport strategy is created
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractedJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users'); //name of the model from User.js
const keys = require('../config/keys');

const opts = {}; //options
opts.jwtFromRequest = ExtractedJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err))
    })
    );
};

//login is created, need to specified on a route for it to be used.