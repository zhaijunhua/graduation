var mongoose = require('mongoose'); // 引入数据库
var Schema = mongoose.Schema;

var sentencesSchema = new Schema({
    'sentenceContent': String,
    'translate': String,
    'author': String,
    'category': String,
    'addTime': Date
},{
    collection: 'sentences'
});
module.exports = mongoose.model('Sentence', sentencesSchema);