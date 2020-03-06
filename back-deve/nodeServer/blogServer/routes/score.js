var express = require('express');
var router = express();  //获取路由
var mysql = require('mysql');
var dbConfig = require('../database/DBConfig');
var pool = mysql.createPool( dbConfig.mysql );
var sql = 'SELECT * FROM studentscore where student_number = ?';
var sql2 = 'SELECT * FROM CompreScore WHERE student_number = ?';
var connection = mysql.createConnection(dbConfig.mysql);
connection.connect();
var responseJSON = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({code:'500', msg: '操作失败'});
    } else {
      res.json(ret);
    }
  };
router.get('/getScore', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    var param = req.query;
    console.log(param);
    connection.query(sql,param.number, function(err,result) {
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
})
router.get('/getCompreScore', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    var param = req.query;
    console.log(param);
    connection.query(sql2,param.student_number, function(err,result) {
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
})

connection.end();
module.exports = router;