var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var fetch = require('node-fetch');

router.get('/', function(req, res, next){
  fetch('http://www.mikeduin.com/nba-all-star-api', {
    method: 'GET'
  }).then(function(res){
    return res.json()
  }).then(function(data){
    var wagers = [];
    var count = 0;
    for (var i=0; i<data.events.length; i++) {
      for (var j=0; j<data.events[i].bets.length; j++) {
        wagers.push(data.events[i].bets[j]);
        wagers[count].event = data.events[i].name;
        wagers[count].time = data.events[i].time;
        count++;
      }
    };
    res.render('makepicks', {wagers: wagers, user: req.user})
  })
})

module.exports = router;
