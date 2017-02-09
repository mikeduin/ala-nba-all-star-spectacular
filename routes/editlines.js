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
  Lines().orderBy('id').then(function(lines){
    res.render('editlines', {lines: lines})
  })
})

router.post('/grade', function(req, res, next){
  var id = req.body.id;
  var result, payout, grade = req.body.grade;
  grade === 'win' ? result = true : result = false;
  Lines().where('id', id).update({
    result: result
  }).then(function(){
    Wagers().where('api_id', id).then(function(wagers){
      for (var i=0; i<wagers.length; i++){
        var risk = wagers[i].risk;
        var win = wagers[i].to_win;
        var betId = wagers[i].api_id;
        result === true ? payout = win : payout = -risk;
        Wagers().where('api_id', betId).update({
          result: result,
          net_total: payout
        }).then(function(){
          console.log('wager updated');
        })
      }
    }).then(function(){
      res.json({
        success: true
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

router.delete('/delete', function(req, res, next){
  var id = req.body.id;
  Lines().where('id', id).del().then(function(){
    Wagers().where('api_id', id).del().then(function(){
      res.json({
        success: true
      })
    })
  })
})

module.exports = router;
