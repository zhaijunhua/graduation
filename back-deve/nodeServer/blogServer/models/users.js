var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    'userId': Number,
    'userPwd': String,
    'userName': String
}, {
    collection: 'user'
});
module.exports = mongoose.model('User', userSchema);