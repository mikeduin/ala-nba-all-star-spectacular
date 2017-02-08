var express = require('express');
var router = express.Router();
var knex = require('../db/knex')
var fetch = require('node-fetch');


router.get('/', function(req, res, next){
  var user = req.user;
  fetch('http://www.mikeduin.com/nba-all-star-api', {
    method: 'GET'
  }).then(function(res){
    return res.json()
  }).then(function(data){
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
    res.render('grade', {lines: bets})
  })
})

module.exports = router;
