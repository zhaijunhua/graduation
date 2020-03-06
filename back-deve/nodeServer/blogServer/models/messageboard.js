var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageabordSchema = new Schema({
    leavecontent: String,
    leaveperson: String,
    date: Date
}, {
    collection: 'leavemessage'
});
module.exports = mongoose.model('Leavemessage', messageabordSchema);