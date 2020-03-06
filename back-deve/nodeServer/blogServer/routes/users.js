var express = require('express');
var router = express();  //获取路由
var mongoose = require('mongoose');
var User = require('../models/users');
var Personal = require('../models/aboutme');
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
// 登录接口
router.post('/login',function(req,res,next){
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(param, function(err,doc) {
    if(err) {
      res.json({  // 报错
          status: '1',
          msg: err.message  // 直接报错
        });
    } else {
      res.cookie('userId', doc.userId, {
        // signed: true, // 加密
        path: '/',  // 将登陆获取的值=cookie值保存
        maxAge: 1000*60*60 // cookie保存时间,这里是一个小时
      });
      console.log(req.headers.cookie);
      // req.session.user = doc; // session可以实时拿到用户信息
      if(doc) { // 使用cookie
        res.json({
          status: '0',
          msg: '',
          result: doc.userName
        });
      }
    }
  })
});
// 登出接口
router.post('/logout', function(req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: '',
    result: ''
  });
});
// 获取个人信息
router.get('/personalmessage', function(req, res, next) {
  Personal.find({}, function(err, data) {
    if(err) {
      res.json({
        status: '00000',
        msg: err.message,
        result: 'ERROR'
      });
    } else {
      res.json({
        status: '10001',
        msg: 'success',
        result: data
      })
    }
  })
});
// 修改个人信息
router.post('/editMessage', function(req, res, next){
  let userId = req.body.id;
  let id = mongoose.Types.ObjectId(userId);
  let resume = req.body.resume;
  let param = {
    _id: id
  };
  let data = {
    resume: resume 
  }
  Personal.findOneAndUpdate(param, data, function(err, data){
    if(err) {
      res.json({
        status: '000000',
        msg: err.message,
        result: 'error'
      });
    } else {
      res.json({
        status: '10001',
        message: 'success',
        result: data
      });
    }
  });
});
module.exports = router;