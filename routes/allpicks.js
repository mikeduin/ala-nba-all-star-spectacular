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

router.get('/user/all/event/all', function(req, res, next){
  Wagers().orderBy('username').then(function(wagers){
    res.json({
      wagers: wagers
    })
  })
})

router.get('/user/:user/event/all', function(req, res, next){
  var user = req.params.user;
  Wagers().where({username: user}).then(function(wagers){
    res.json({
      wagers: wagers
    })
  })
})

router.get('/user/all/event/:event', function(req, res, next){
  var event = req.params.event;
  Wagers().where({event: event}).orderBy('username').then(function(wagers){
    res.json({
      wagers: wagers
    })
  })
})

router.get('/user/:user/event/:event', function(req, res, next){
  var user = req.params.user;
  var event = req.params.event;
  Wagers().where({username: user, event: event}).then(function(wagers){
    res.json({
      wagers: wagers
    })
  })
})

module.exports = router;
