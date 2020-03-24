var express = require('express');
var router = express();  //获取路由
var mysql = require('mysql');
var dbConfig = require('../database/DBConfig');
var pool = mysql.createPool( dbConfig.mysql );
// var sql = 'select * from scorerank where student_number = ?';
var sql = 'SELECT *,(select Count(*) from qualitypoint) as count FROM qualitypoint LIMIT ?, ?';
// var sql2 = 'SELECT *, FROM qualitypoint WHERE student_number = ?'
var sql2 = `SELECT
*, (
  SELECT
    Count(*)
  FROM
    qualitypoint WHERE student_number = ?
) AS count
FROM
qualitypoint
WHERE
student_number = ? LIMIT ?,?`;
var sql3 = 'SELECT *,(select Count(*) from applylist) as count FROM applylist LIMIT ?, ?';
var sql4 = `SELECT
*, (
  SELECT
    Count(*)
  FROM
    applylist WHERE student_number = ?
) AS count
FROM
applylist
WHERE
student_number = ? LIMIT ?,?`;
// var sql4 = 'SELECT * FROM applylist WHERE student_number = ?';
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
    let param = req.query || req.params;
    let rows = parseInt(param.rows);
    let page = parseInt(param.page-1);
    connection.query(sql,[page*rows,rows],function(err,result) {
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
    let param = req.query;
    let number = param.studentNumber;
    let rows = parseInt(param.rows);
    let page = parseInt(param.page);
    connection.query(sql2,[number, number, (page-1)*rows, rows], function(err,result) {
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
router.get('/getSrefuseapply', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    let inSql = 'SELECT *,(select Count(*) from unqualitypoint) as count FROM unqualitypoint LIMIT ?, ?';
    let param = req.query;
    let rows = parseInt(param.rows);
    let page = parseInt(param.page);
    connection.query(inSql, [(page-1)*rows, rows], function(err,result) {
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
router.get('/getSpassapply', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    let inSql = 'SELECT *,(select Count(*) from inqualitypoint) as count FROM inqualitypoint LIMIT ?, ?';
    let param = req.query;
    let rows = parseInt(param.rows);
    let page = parseInt(param.page);
    connection.query(inSql, [(page-1)*rows, rows], function(err,result) {
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
    let param = req.query;
    let rows = parseInt(param.rows);
    let page = parseInt(param.page-1);
    connection.query(sql3, [(rows-1)*page, rows],function(err,result) {
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
    let param = req.query || req.params;
    let number = param.studentNumber;
    let rows = parseInt(param.rows);
    let page = parseInt(param.page);
    connection.query(sql4, [number, number, (page-1)*rows, rows], function(err,result) {
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