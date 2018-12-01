const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    date: { type: Date, default: Date.now },

});

module.exports = User = mongoose.model('users', UserSchema); //assign var as User, first param is the name we want to use, 2nd is the actual schema