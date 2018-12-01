const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load Input Validation
const validateRegisterInput = require('../validation/register')

//load User model
const User = require('../models/User')

//@route GET api/users/test
//@desc Tests users route
//@access Public

router.get('/test', (req, res) => res.json({ msg: "users works" })); //this is not just referring to '/test' route but '/api/users/test' due to middlewareo n server.js

//
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    //first line of validation, not inside the db yet
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {

        if (user) {
            return res.status(400).json({ email: 'Email already exusts' });
        } else {
            const avatar = gravatar.url(req.bidy.email, {
                s: '200',//size
                r: 'pg', //rating
                d: 'mm'//default

            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });
            //hash the pw, save to db
            bcript.genSalt(10, (err, salt) => {
                bcript.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })
        }
    });

});


//@route GET api/users/login
//@desc login the user, returning the json web-token
//@access Public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //check the user vd the db
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: 'User not found' });
            }
            //check string pw against the hased pw via bcript, string, access to pw in the db,isMatch is boolean
            bcript.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //user matched
                        //create a payload with the basic user info, creating the jwt payload
                        const payload = { id: user.id, name: user.name, avatar: user.avatar }
                        //sign the jwt, written in the docs,referencing in the key.js file
                        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            res.json({ success: true, token: 'Bearer' + token });
                        });//token expires in one hour,user needs to relog

                    } else {
                        return res.status(404).json({ password: 'Password incorrect' });
                    }
                });
        });
});

//@route GET api/users/current
//@desc Tests returning the current user, whoever this current token belongs to
//@access Private
router.get('/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    });

module.exports = router;