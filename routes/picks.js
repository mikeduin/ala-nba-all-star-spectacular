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
    for (var i=0; i<data.events.length; i++) {
      for (var j=0; j<data.events[i].bets.length; j++) {
        wagers.push(data.events[i].bets[j])
      }
    };
    res.render('makepicks', {wagers: wagers})
  })
})

module.exports = router;
