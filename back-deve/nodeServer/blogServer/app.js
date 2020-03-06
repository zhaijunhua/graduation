
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var app = express();
// var users = require('./routes/users');
var blogs = require('./routes/blogs');
var score = require('./routes/score');
var getRankMsg = require('./routes/getRankMsg');
var getApply = require('./routes/getApply');
var addApply = require('./routes/addApply');
// var sentences 
// = require('./routes/sentences');
// var messageboard = require('./routes/messageboard');
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.disable('etag');
// app.set('view engine', 'jade'); // jade比较简洁
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// app.use(function(req, res, next) {  // 登录拦截，一些功能必须先进行登录之后才能使用
//   if (req.cookies.userId) {
//     next();
//   } else {
//     if (req.originalUrl === 'api/users/login' || req.originalUrl === 'api/users/logout') {
//       next();
//     }  else {
//       res.json({
//         status: '10011',
//         msg: '当前未登录',
//         result: ''
//       })
//     }
//   }
// });
app.use('/blogs',blogs);
app.use('/score', score);
app.use('/getRankMsg', getRankMsg);
app.use('/getApply', getApply);
app.use('/addApply', addApply);
// app.use('/sentences', sentences);
// app.use('/users', users);
// app.use('/messageboard', messageboard);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
// app.get('/users', users);
app.get('/blogs',blogs);
app.get('/score', score);
app.get('/getRankMsg', getRankMsg);
app.get('/getApply', getApply);
app.get('/addApply', addApply);
// app.get('/sentences', sentences);
// app.get('/messageboard', messageboard);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
