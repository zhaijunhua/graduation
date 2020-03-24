var express = require('express');
var router = express();  //获取路由
var mysql = require('mysql');
var dbConfig = require('../database/DBConfig');
var pool = mysql.createPool( dbConfig.mysql );
var sql = 'SELECT *,(select Count(*) from studentScore WHERE student_number = ?) as count FROM studentScore WHERE student_number = ? LIMIT ?, ?';
var sqlYear = `SELECT
*, (
  SELECT
    Count(*)
  FROM
    studentScore
  WHERE
    student_number = ?
  AND schoolYear = ?
) AS count
FROM
studentScore
WHERE
student_number = ?
AND schoolYear = ? LIMIT ?, ?`
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
    let param = req.query || req.params;
    let studentNumber = param.studentNumber;
    let rows = parseInt(param.rows);
    let page = parseInt(param.page-1);
    let year = param.year;
    console.log('年' + year);
    if(!year || year == 'undefined' || year == '') {
      console.log('1112');
      connection.query(sql,[studentNumber,studentNumber,(rows-1)*page,rows], function(err,result) {
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
      console.log('2222');
      connection.query(sqlYear,[studentNumber, year, studentNumber, year, (rows-1)*page,rows], function(err,result) {
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
    }
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