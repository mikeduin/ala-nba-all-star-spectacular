var express = require('express');
var router = express.Router();
var knex = require('../db/knex')

function Wagers () {
  return knex('wagers')
};

router.get('/', function(req, res, next){
  Wagers().orderBy('username').then(function(wagers){
    res.render('allpicks', {wagers: wagers})
  })
})

module.exports = router;
