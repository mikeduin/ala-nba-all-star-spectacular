var express = require('express');
var router = express.Router();
var knex = require('../db/knex')
var fetch = require('node-fetch');
var fs = require('fs');

function Wagers () {
  return knex('wagers')
}

function Lines () {
  return knex('lines')
}


router.get('/', function(req, res, next){
  Lines().then(function(lines){
    res.render('editlines', {lines: lines})
  })
})

router.post('/win', function(req, res, next){
  var id = req.body.id;
  Lines().where('id', id).update({
    result: true
  }).then(function(){
    Wagers().where('api_id', id).then(function(wagers){
      for (var i=0; i<wagers.length; i++){
        var win = wagers[i].to_win;
        var betId = wagers[i].api_id;
        Wagers().where('api_id', betId).update({
          result: true,
          net_total: win
        }).then(function(){
          console.log('wager updated');
        })
      }
    }).then(function(){
      res.json({
        success: 'yes'
      })
    })
  })
})

router.post('/add', function(req, res, next){
  var line = req.body;
  Lines().insert({
    event: req.body.event,
    time: req.body.time,
    type: req.body.type,
    side: req.body.side,
    odds: req.body.odds
  }).then(function(){
    res.json(line)
  })
})

router.put('/update', function(req, res, next){
  var line = req.body;
  var id = req.body.id;
  Lines().where('id', id).update({
    event: req.body.event,
    time: req.body.time,
    type: req.body.type,
    side: req.body.side,
    odds: req.body.odds
  }).then(function(){
    res.json(line)
  })
})

module.exports = router;
