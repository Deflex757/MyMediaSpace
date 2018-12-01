//validator only check for strings and not other data types, this file makes it so that it checks for all data types


//es5
// function isEmpty(value) {
//     return (
//         value === undefined ||
//         value === null ||
//         (typeof value === 'object' && Object.keys(value).length === 0) ||//if the length of keys is 0 then it's an empty object
//         (typeof value === 'string' && value.trim().length === 0) //empty string
//     );
// }


//using es6
const isEmpty = value =>
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;