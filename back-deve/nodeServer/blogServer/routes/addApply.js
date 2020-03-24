var express = require('express');
var router = express();  //获取路由
var mysql = require('mysql');
var dbConfig = require('../database/DBConfig');
var pool = mysql.createPool( dbConfig.mysql );
// var sql = 'select * from scorerank where student_number = ?';
var sql = 'INSERT INTO qualitypoint (student_number, schoolYear ,student_name, for_reason, add_score) VALUES (?, ?, ?, ?, ?)';
var sql2 = 'INSERT INTO applylist (student_number, student_name, schoolYear, apply_reason, student_major, award_type) VALUES (?, ?, ?, ?, ?, ?)';

var connection = mysql.createConnection(dbConfig.mysql);
connection.connect();
var responseJSON = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({code:'500', msg: '操作失败'});
    } else {
      res.json(ret);
    }
  };
router.post('/addScoreApply', function(req, res, next) {
  var param = req.body;
  console.log(param.studentNumber);
  pool.getConnection(function(err, connection) {
    connection.query(sql, [param.studentNumber, param.schoolYear, param.studentName, param.reason, param.addScore], function(err,result) {
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
router.post('/addAwardApply', function(req, res, next) {
  var param = req.body;
  pool.getConnection(function(err, connection) {
    connection.query(sql2, [param.studentNumber, param.studentName,  param.schoolYear, param.reason, param.studentMajor, param.awardType ], function(err,result) {
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
router.post('/updateScoreApply', function(req, res, next) {
  let updateSql = `UPDATE qualitypoint SET apply_status = ? WHERE id = ?`
  var param = req.body;
  let status = param.status;
  let applyId = param.applyId;
  pool.getConnection(function(err, connection) {
    connection.query(updateSql, [status, applyId], function(err,result) {
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
// 不通过插入另一个表中
router.post('/addUnSApply', function(req, res, next) {
  let insertSql = 'insert into unqualitypoint select * from qualitypoint where id = ?;'
  var param = req.body;
  let unSapplyId = param.applyId;
  pool.getConnection(function(err, connection) {
    connection.query(insertSql, [unSapplyId], function(err,result) {
      if(result) {
        connection.query('delete from qualitypoint where id=?;', [unSapplyId], function(err,result) {
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
      } else {
        responseJSON(res, err);
        connection.release();
      }
    })
  })
});
// 综合素质通过审批放入另外一张表x
router.post('/addInSApply', function(req, res, next) {
  let insertSql = `insert into inqualitypoint select * from qualitypoint where id = ?;`
  var param = req.body;
  let applyId = param.applyId;
  pool.getConnection(function(err, connection) {
    connection.query(insertSql, applyId, function(err,result) {
      if(result) {
        connection.query('delete from qualitypoint where id=?;', applyId, function(err,result) {
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
      } else {
        responseJSON(res, err);
        connection.release();
      }
    })
  })
});
connection.end();
module.exports = router;