var express = require('express');
var router = express();  //获取路由
var mysql = require('mysql');
var dbConfig = require('../database/DBConfig');
var pool = mysql.createPool( dbConfig.mysql );
// var sql = 'select * from scorerank where student_number = ?';
var sql = 'SELECT * FROM qualitypoint';
var sql2 = 'SELECT * FROM qualitypoint WHERE student_number = ?'
var sql3 = 'SELECT * FROM applylist';
var sql4 = 'SELECT * FROM applylist WHERE student_number = ?';
var connection = mysql.createConnection(dbConfig.mysql);
connection.connect();
var responseJSON = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({code:'500', msg: '操作失败'});
    } else {
      res.json(ret);
    }
  };
router.get('/getALLSApply', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    connection.query(sql, function(err,result) {
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
router.get('/getSapply', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    var param = req.query;
    connection.query(sql2,param.number, function(err,result) {
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
router.get('/getAllAwardApply', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    connection.query(sql3, function(err,result) {
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
router.get('/getAwardApply', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    var param = req.query;
    connection.query(sql4,param.number, function(err,result) {
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
module.exports = router;