//rules for registration
const Validator = require('validator');
// import isEmpty from './is-empty'; //es5 import
const isEmpty = require('./is-empty'); //es6 import

module.exports = function validateRegisterInput(data) {
    let errors = {};
    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors, name = 'Name must be btw 2 to 30 characters';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
};