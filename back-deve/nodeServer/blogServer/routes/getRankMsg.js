var express = require('express');
var router = express();  //获取路由
var mysql = require('mysql');
var dbConfig = require('../database/DBConfig');
var pool = mysql.createPool( dbConfig.mysql );
// var sql = 'select * from scorerank where student_number = ?';
var sql = 'SELECT b.* FROM (SELECT t.*, @rownum := @rownum + 1 AS rownum  FROM (SELECT @rownum := 0) r,(SELECT * FROM scorerank ORDER BY avgScore DESC) AS t) AS b WHERE b.student_number = ?';
var sql2 = `SELECT
b.*
FROM
(
  SELECT
    t.*, @rownum := @rownum + 1 AS rownum
  FROM
    (SELECT @rownum := 0) r,
    (
      SELECT
        scorerank.student_number,(scorerank.avgScore * 0.7 + comprescore.compreScore*0.3) as finalA
      FROM
        scorerank,comprescore
      GROUP BY scorerank.student_number
      ORDER BY
        finalA DESC
    ) AS t
) AS b
WHERE
b.student_number = ?`;
var avgRankSql = `SELECT
b.*
FROM
(
  SELECT
    t.*, @ranknum := @ranknum + 1 AS ranknum
  FROM
    (SELECT @ranknum := 0) r,
    (
      SELECT
        scorerank.avgScore,
        scorerank.student_number,
        scorerank.student_grade,
        studentmanage.student_major
      FROM
        scorerank,studentmanage
      WHERE studentmanage.student_major = ? and scorerank.student_grade = ?
     GROUP BY scorerank.student_number
      ORDER BY
        avgScore DESC
    ) AS t
) AS b
WHERE
b.student_number = ?`; // 成绩总排名
// 综合排名
var finalRankSql = `SELECT
b.*
FROM
(
  SELECT
    t.*, @rownum := @rownum + 1 AS rownum
  FROM
    (SELECT @rownum := 0) r,
    (
      SELECT
        scorerank.student_number,(scorerank.avgScore * 0.7 + comprescore.compreScore*0.3) as finalA
      FROM
        scorerank,comprescore,studentmanage
      WHERE studentmanage.student_major = ? and scorerank.student_grade = ?
      GROUP BY scorerank.student_number
      ORDER BY
        finalA DESC
    ) AS t
) AS b
WHERE
b.student_number = 2016210973`;
var connection = mysql.createConnection(dbConfig.mysql);
connection.connect();
var responseJSON = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({code:'500', msg: '操作失败'});
    } else {
      res.json(ret);
    }
  };
router.get('/getRank', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    var param = req.query;
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
});
router.get('/getAvgRank', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    let param = req.query;
    let studentMajor = param.studentMajor;
    let studentGrade = param.studentGrade;
    let studentNumber = param.studentNumber;
    connection.query(avgRankSql,[studentMajor, studentGrade, studentNumber], function(err,result) {
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

// 获得综合排名
router.get('/finalRankSql', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    let param = req.query;
    let studentMajor = param.studentMajor;
    let studentGrade = param.studentGrade;
    let studentNumber = param.studentNumber;
    connection.query(avgRankSql,[studentMajor, studentGrade, studentNumber], function(err,result) {
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