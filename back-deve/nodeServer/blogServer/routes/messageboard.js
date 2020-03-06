var express = require('express');
var router = express();
var mongoose = require('mongoose');
var Leavemessage = require('../models/messageboard');

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

router.post('/write', function(req, res, next){
    let newMessage = new Leavemessage({
        leavecontent: req.body.leavecontent,
        leaveperson: req.body.leaveperson,
        date: req.body.date ? new Date():new Date(parseInt(req.body.date))
    });
    newMessage.save(function(err,doc) {
        if (err) {
            return res.json({
                status: '0',
                msg: err.message
            });
        }
        res.json({
            status: '1',
            data: doc
        });
    });
});
router.get('/getleaveMessage', function(req, res, next) {
    // var page = req.param('page');
    // let pageSize = parseInt(req.param('pageSize'));
    // let skip = (page-1) * pageSize;
    // let params = {};
    // let message = Leavemessage.find(params).skip(params).skip(skip).limit(pageSize); 

    Leavemessage.find({}, function(err, doc){
        if (err) {
            res.json({
                status: '0',
                msg: err.message
            });
        } else {
            res.json({
                status: '1',
                msg: 'success',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});
 router.post('/deleteLeave', function(req, res, next){
     var id = req.body.id;
     var findId = mongoose.Types.ObjectId(id);
     var param = {
         _id: findId
     };
     Leavemessage.findOneAndRemove(param, function(err, doc) {
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
module.exports = router;