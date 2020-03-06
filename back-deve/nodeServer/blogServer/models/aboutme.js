var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myselfSchema = new Schema({
    "resume": String
}, {
    collection: 'myself'
});

module.exports = mongoose.model('Personal', myselfSchema);