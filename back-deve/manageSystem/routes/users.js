var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({      //创建mysql实例
  host:'127.0.0.1',
  port:'3306',
  user:'root',
  password:'zjh980904',
  database:'assessmentsystem'
});
connection.connect();

/* GET users listing. */
var sql = 'SELECT * FROM studentmanage';
connection.query(sql, function (err,result) {
    if(err){
        console.log('[SELECT ERROR]:',err.message);
    }
    console.log(result);  //数据库查询结果返回到result中
 
});
router.get('/',function (req,res, next) {
    res.send('Hello,myServer');  ////服务器响应请求
});
connection.end();

module.exports = router;
