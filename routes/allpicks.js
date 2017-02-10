var express = require('express');
var router = express.Router();
var knex = require('../db/knex')

function Wagers () {
  return knex('wagers')
};

router.get('/', function(req, res, next){
  Wagers().orderBy('username').then(function(wagers){
    Wagers().distinct('username').select().orderBy('username').then(function(users){
      console.log('users are ', users);
      res.render('allpicks', {wagers: wagers, users:users})
    })
  })
})

module.exports = router;
