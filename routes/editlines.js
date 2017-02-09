var express = require('express');
var router = express.Router();
var knex = require('../db/knex')
var fetch = require('node-fetch');
var fs = require('fs');

function Wagers () {
  return knex('wagers')
}


router.get('/', function(req, res, next){
  var user = req.user;
  var data = JSON.parse(fs.readFileSync('public/javascripts/odds.json'));
  var bets = [];
  var count = 0;
  for (var i=0; i<data.events.length; i++) {
    for (var j=0; j<data.events[i].bets.length; j++) {
      bets.push(data.events[i].bets[j]);
      bets[count].event = data.events[i].name;
      bets[count].time = data.events[i].time;
      count++;
    }
  };
  res.render('editlines', {lines: bets})
})

router.post('/win', function(req, res, next){
  var id = req.body.id;
  Wagers().where('api_id', id).then(function(wagers){
    console.log(wagers);
    for (var i=0; i<wagers.length; i++){
      var win = wagers[i].to_win;
      var betId = wagers[i].id;
      console.log('win amount is ', win);
      Wagers().where('id', betId).update({
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

module.exports = router;
