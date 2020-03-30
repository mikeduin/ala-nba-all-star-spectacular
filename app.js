var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').config();
var knex = require('./db/knex.js');
var session = require('cookie-session');
var passport = require('passport');
require('./services/passport');

var index = require('./routes/index');
var auth = require('./routes/auth');
var user = require('./routes/user');
var results = require('./routes/results');
var picks = require('./routes/picks');
var allpicks = require('./routes/allpicks');
var editlines = require('./routes/editlines');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// COOKIE PARSER MUST GO ABOVE SESSION / PASSPORT INITIALIZATION!!

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    maxAge: 90 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {
  let user = Array.isArray(req.user) ? req.user[0] : req.user;
  res.locals.user = user;
  next();
})

app.locals.moment = require('moment');

app.use('/', index);
app.use('/auth', auth);
app.use('/results', results);
app.use('/user', user);
app.use('/picks', picks);
app.use('/allpicks', allpicks);
app.use('/editlines', editlines);

app.get('/rules', function(req, res, next){
  res.render('rules');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
