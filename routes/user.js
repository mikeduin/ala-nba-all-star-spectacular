var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

var checkLoggedIn = function(req, res, next) {
  if (!req.user) {
    res.redirect('/');
  }
  else {
    next();
  }
};

// var checkAuthor = function(req, res, next) {
//   knex('stories').first().where('id', req.params.id).then(function(story) {
//     if (req.user.id !== story.user_id) {
//       res.redirect('/');
//     }
//     else {
//       next();
//     }
//   });
// };

function Wagers() {
  return knex('wagers');
}

function Users() {
  return knex('users');
}

router.get('/:username', function(req, res, next) {
  Wagers().select().where('username', req.params.username).then(function(wagers){
    res.render('user', {wagers: wagers})
  });
});

module.exports = router;
