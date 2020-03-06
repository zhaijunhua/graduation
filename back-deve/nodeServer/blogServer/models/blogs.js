var mongoose = require('mongoose'); // 引入数据库
var Schema = mongoose.Schema;

var blogMessageSchema = new Schema({
    "blogTitle": String,
    "blogTime": {
        type: Date,
        default: Date.now()
    },
    "blogContent": String,
    "category": String,
    "introduce": String
}, {
    collection: 'blogMessage'
});


module.exports = mongoose.model('Blog', blogMessageSchema);
