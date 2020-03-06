var express = require('express');
var router = express();  //获取路由
// var mongoose = require('mongoose');
var mysql = require('mysql');
var dbConfig = require('../database/DBConfig');

// var querySql = require('querysql');

//使用DBConfig中配置信息创建一个MySQL连接池

var pool = mysql.createPool( dbConfig.mysql );
// var connection = mysql.createConnection({      //创建mysql实例
//     host:'127.0.0.1',
//     port:'3306',
//     user:'root',
//     password:'zjh980904',
//     database:'assessmentsystem'
//   });
var connection = mysql.createConnection(dbConfig.mysql);
connection.connect();
  
  /* GET users listing. */
var sql = 'SELECT * FROM studentmanage';
var sql2 = 'SELECT * FROM studentmanage where student_number = ?';
// var pool = mysql.createPool( connection );

// 响应一个JSON数据

var responseJSON = function (res, ret) {
  if(typeof ret === 'undefined') {
      res.json({code:'500', msg: '操作失败'});
  } else {
    res.json(ret);
  }
};
connection.query(sql, function (err,result) {
    if(err){
          console.log('[SELECT ERROR]:',err.message);
        }
    // console.log(result);  //数据库查询结果返回到result中
    str = JSON.stringify(result);
    //数据库查询的数据保存在result中，但浏览器并不能直接读取result中的结果，因此需要用JSON进行解析
    //console.log(result);   //数据库查询结果返回到result中
    // console.log(str);
});
router.get('/studentMess',function(req, res, next) {
    res.send(str);
});
router.get('/getInfo', function(req, res, next){
    pool.getConnection(function(err, connection){
        console.log('1111' + JSON.stringify(req.query));
        var params = req.query;
        // var param = URL.parse(req.url, true).query;
        connection.query(sql2,params.student_id, function(err, result){
          if(result){
            dataRes = {
              code: 200, 
              info: result
            } 
            responseJSON(res, dataRes);
    connection.release();
      }else{
        responseJSON(res, err);
        connection.release();
      }
    })
  })
})


connection.end();
module.exports = router; // 必须进行输出

