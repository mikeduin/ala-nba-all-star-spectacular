var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var knex = require('./db/knex.js');
var session = require('cookie-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').load();

var index = require('./routes/index');
var user = require('./routes/user');
var results = require('./routes/results');
var picks = require('./routes/picks');
var allpicks = require('./routes/allpicks');
var grade = require('./routes/grade');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj, done){
  done(null, obj);
})

passport.use('facebook', new FacebookStrategy({
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_APP_SECRET,
  callbackURL: 'http://localhost:3000/login/facebook/callback',
  profileFields: ['id', 'email', 'displayName', 'photos', 'first_name', 'last_name', 'hometown', 'link']
},

  // facebook will send back the tokens + profile
  function(accessToken, refreshToken, profile, done) {
    var email = profile.emails[0].value;
    var username = email.split('@')[0];
    knex('users').first().where('email', email).then(function(user){
      if (!user) {
        knex('users').insert({
          email: email,
          username: username,
          first_name: profile._json.first_name,
          last_name: profile._json.last_name,
          hometown: profile._json.hometown.name,
          fb_profile: profile._json.link,
          facebookid: profile.id,
          photo: profile.photos[0].value,
          superuser: false
        }, '*').then(function(user){
          done(null, user[0]);
        });
      } else {
        done(null, user);
      }
    })
  })
)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'session',
  keys: [process.env.SESSION_KEY]
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
})

app.locals.moment = require('moment');

app.use('/', index);
app.use('/results', results);
app.use('/user', user);
app.use('/picks', picks);
app.use('/allpicks', allpicks);
app.use('/grade', grade);

app.get('/rules', function(req, res, next){
  res.render('rules');
})

app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_hometown']})
);

app.get('/login/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

app.get('/logout', function(req, res){
  req.logOut();
  req.session = null;
  res.redirect('/');
});

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
