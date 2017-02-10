var express = require('express');
var router = express.Router();
var knex = require('../db/knex')

function Wagers () {
  return knex('wagers')
};

router.get('/', function(req, res, next){
  Wagers().orderBy('username').then(function(wagers){
    Wagers().distinct('username').select().orderBy('username').then(function(users){
      res.render('allpicks', {wagers: wagers, users:users})
    })
  })
})

router.get('/user/:user', function(req, res, next){
  var user = req.params.user;
  console.log('user is ', user);
  Wagers().where({username: user}).then(function(wagers){
    console.log('wagers are ', wagers);
    res.json({
      wagers: wagers
    })
  })
})

module.exports = router;
