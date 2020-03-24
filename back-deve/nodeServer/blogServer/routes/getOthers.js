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
router.get('/getYear', function(req, res, next) {
  let yearSql = 'select schoolYear from studentscore WHERE student_number = ? GROUP BY schoolYear';
  pool.getConnection(function(err, connection) {
    let param = req.query || req.params;
    let studentNumber = param.studentNumber;
    connection.query(yearSql,[studentNumber], function(err,result) {
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
router.get('/getAcademy', function(req, res, next) {
  let acaSql = `select * from academylist`;
  pool.getConnection(function(err, connection) {
    connection.query(acaSql, function(err,result) {
      if(result) {
        let acalist = []
        for(var i=0;len=result.length,i<len;i++){
              result[i]["children"]=[];
              acalist.push(JSON.parse(JSON.stringify(result[i])));
        }
        connection.query(`select * from majorlist`, function(err, result1) {
          if(result1) {
            let acaTreeList = JSON.parse(JSON.stringify(acalist));
            let majorlist = result1;
            console.log(acalist);
            for(var i=0; i< acalist.length; i++) {
              var a = acalist[i].id;
              for(var j =0; j <majorlist.length; j++) {
                console.log("liceng" + a);
                  if(majorlist[j].acaId == a) {
                    console.log(majorlist[j]);
                    acaTreeList[i]['children'].push(majorlist[j]);
                  }
              }
            }
            console.log(acaTreeList);
            dataRes = {
              code:200,
              data: acaTreeList
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
})
router.get('/getmajor', function(req, res, next) {
  let yearSql = `select * from majorlist`;
  pool.getConnection(function(err, connection) {
    connection.query(yearSql, function(err,result) {
      if(result) {
        let result1 =JSON.parse(JSON.stringify(result));
        let resultData = buildTree(result1);
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
  })
});

router.post('/addAcademy', function(req, res, next) {
  let addsql = 'insert into academylist (student_academy) values(?)'
  var param = req.body;
  pool.getConnection(function(err, connection) {
    connection.query(addsql, [param.student_academy], function(err,result) {
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
router.post('/deleteAcademy', function(req, res, next) {
  var param = req.body;
  pool.getConnection(function(err, connection) {
    connection.query(sql2, [param.student_academy], function(err,result) {
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