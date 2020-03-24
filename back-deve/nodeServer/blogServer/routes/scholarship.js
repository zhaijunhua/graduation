var express = require('express');
var router = express();  //获取路由
var mysql = require('mysql');
var dbConfig = require('../database/DBConfig');
var pool = mysql.createPool( dbConfig.mysql );
var connection = mysql.createConnection(dbConfig.mysql);
connection.connect();
var responseJSON = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({code:'500', msg: '操作失败'});
    } else {
      res.json(ret);
    }
  };
router.get('/getScholarshipType', function(req, res, next) {
  let getScl = 'select * from scholarship';
  pool.getConnection(function(err, connection) {
    let param = req.query || req.params;
    connection.query(getScl, function(err,result) {
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
router.post('/addscholarshipApply', function(req, res, next) {
  let addSql = `INSERT INTO scholarshipapply (
    student_name,
    student_number,
    student_major,
    student_academy,
    student_grade,
    schoolYear,
    scholarshipType
  ) VALUES
  (?, ?, ?, ?, ?, ?, ?)`
  let params = req.body || req.query;
  let studentName = params.studentName;
  let studentNumber = params.studentNumber;
  let studentMajor = params.studentMajor;
  let studentAcademy = params.studentAcademy;
  let studentGrade = params.studentGrade;
  let schoolYear = params.schoolYear;
  let scholarshipType = params.scholarshipType;
  let postItem = [studentName, studentNumber,studentMajor, studentAcademy, studentGrade, schoolYear, scholarshipType];
  pool.getConnection(function(err, connection) {
    connection.query(addSql, postItem, function(err,result) {
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

router.get('/getScholarshipById', function(req, res, next) {
  let getScl = 'select * from scholarshipapply where student_number=?';
  let param = req.query;;
    console.log(param);
  let studentNumber = param.studentNumber;
  pool.getConnection(function(err, connection) {
    connection.query(getScl, [studentNumber] ,function(err,result) {
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

router.get('/getScholarshipList', function(req, res, next) {
  let getScl = 'select * from scholarshipapply where applyStatus = ? LIMIT ?, ?';
  pool.getConnection(function(err, connection) {
    let param = req.query || req.params;
    let rows = parseInt(param.rows);
    let page = parseInt(param.page-1);
    let applyStatus = param.applyStatus
    connection.query(getScl, [applyStatus,page*rows, rows], function(err,result) {
      if(result) {
        connection.query(`select Count(*) as count from scholarshipapply where applyStatus = ?`,applyStatus,function(err,result1) {
          if(result1) {
            let resultData = {};
            resultData.total = result1[0].count;
            resultData.list = result;
            dataRes = {
              code:200,
              data: resultData
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
// 更新
router.post('/updateScholarship', function(req, res, next) {
  let updateSql = `UPDATE scholarshipapply SET applyStatus = ? WHERE id = ?`
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

router.post('/addInScholarship', function(req, res, next) {
  let insertSql = 'insert into finalScholarship select * from scholarshipapply where id = ?;'
  var param = req.body;
  let applyId = param.applyId;
  pool.getConnection(function(err, connection) {
    connection.query(insertSql, [applyId], function(err,result) {
      if(result) {
          dataRes = {
            code:200,
            data: result
          };
          responseJSON(res, dataRes);
          connection.release();
        // connection.query('delete from qualitypoint where id=?;', [unSapplyId], function(err,result) {
        //   if(result) {
        //     dataRes = {
        //       code:200,
        //       data: result
        //     };
        //     responseJSON(res, dataRes);
        //     connection.release();
        //   } else {
        //     responseJSON(res, err);
        //     connection.release();
        //   }
        // })
      } else {
        responseJSON(res, err);
        connection.release();
      }
    })
  })
});
connection.end();
module.exports = router;