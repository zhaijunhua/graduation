var express = require('express'); // 依赖
var routers = express();
var mongoose = require('mongoose');
var Sentence = require('../models/sentences');


mongoose.connect('mongodb://127.0.0.1:27017/blogs');
mongoose.connection.on("connected", function() {
    console.log("MongoDB Connect Success");
});

mongoose.connection.on("error", function() {
    console.log("MongoDB connect Filed");
})
mongoose.connection.on("disconnected", function() {
    console.log("MongoDB connect disconnected");
});

routers.post('/addSentence', function(req, res) {
    let newSentence = new Sentence({
        sentenceContent: req.body.sentenceContent,
        author: req.body.author,
        category: req.body.category,
        addTime: req.body.addTime ? new Date():new Date(parseInt(req.body.date))
    });
    newSentence.save(function(err, doc) {
        if (err) {
            return res.json({
                status: '0',
                msg: err.message
            });
        } 
        res.json({
            status: '1',
            msg: 'success',
            data: doc
        });
    });
});
routers.get('/', function(req,res, next) {
    var cate = req.query.cate;
    // 进行判断
    var param = {};
    var cateNumber = '';
    if(cate != '0'){
        switch (cate) {
            case '1': cateNumber = 1; break;
            case '2': cateNumber = 2; break;
        };
        param = {
            category: cateNumber
        };
    } else {
        param = {}
    }
    Sentence.find(param, function(err, doc) {
        if(err) {
            res.json({
                status: 0,
                msg: err.message
            });
        } else {
            res.json({
                status: 1,
                msg: 'success GET',
                result: {
                    count: doc.length,
                    list: doc
                }
            });
        }
    });
});

routers.get('/curSntence', function(req,res, next) {
    var id = req.query.id;
    var objId = mongoose.Types.ObjectId(id);
    var param = {
        _id: objId
    };
    Sentence.find(param, function(err, doc) {
        if(err) {
            res.json({
                status: 0,
                msg: err.message
            });
        } else {
            res.json({
                status: 1,
                msg: 'success GET',
                result: {
                    count: doc.length,
                    list: doc
                }
            });
        }
    });
});

routers.post('/deleteSentence', function(req, res, next) {
    let id = req.body.id;
    let sentenceId = mongoose.Types.ObjectId(id);
    let param = {
        _id: sentenceId
    };
    Sentence.findOneAndRemove(param, function(err, doc) {
        if(err) {
            res.json({
                status: '00000',
                msg: err.message
            });
        } else {
            res.json({
                status: '10001',
                msg: 'success',
                result: doc
            });
        }
    });
});

routers.post('/editSentence', function(req, res, next) {
    let sentenceId = req.body.sentenceId;
    let id = mongoose.Types.ObjectId(sentenceId);
    let sentenceContent = req.body.sentenceContent;
    let translate = req.body.translate;
    let author = req.body.author;
    let category = req.body.category;
    let data = {
        sentenceContent: sentenceContent,
        translate: translate,
        author: author,
        category: category
    };
    Sentence.findOneAndUpdate({_id:id}, data, function(err, doc) {
        if(err) {
            res.json({
                status: '00000',
                mas: err.message,
                resulr: 'error'
            });
        } else {
            res.json({
                status: '10001',
                msg: 'success',
                result: doc
            });
        }
    })

})
module.exports = routers;