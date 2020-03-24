var express = require('express');
var router = express();  //获取路由
var mysql = require('mysql');
var dbConfig = require('../database/DBConfig');
var pool = mysql.createPool( dbConfig.mysql );
//使用DBConfig中配置信息创建一个MySQL连接池
var sql = 'SELECT * FROM studentmanage';
var sql2 = 'SELECT * FROM studentmanage where student_number = ?';

var connection = mysql.createConnection(dbConfig.mysql);
connection.connect();
var connection = mysql.createConnection(dbConfig.mysql);
connection.connect();
var responseJSON = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({code:'500', msg: '操作失败'});
    } else {
      res.json(ret);
    }
  }; 
router.get('/studentMess',function(req, res, next) {
    res.send(str);
});
router.get('/getInfoById', function(req, res, next) {
    pool.getConnection(function(err, connection) {
      let param = req.query;
      connection.query(sql2, [param.studentNumber],function(err,result) {
        if(result) {
          dataRes = {
            code:200,
            data: result
          };
          responseJSON(res, dataRes);
          connection.release();
        } else {
          responseJSON(res, err);
          connection.release();
        }
      })
    })
  });


connection.end();
module.exports = router; // 必须进行输出

