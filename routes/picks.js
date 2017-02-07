var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var fetch = require('node-fetch');

function Wagers() {
  return knex('wagers');
}

function Users() {
  return knex('users');
}

router.get('/', function(req, res, next){
  var user = req.user;
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
    if (user) {
      Wagers().select('event', 'wager', 'odds', 'risk').where({username: user.username}).then(function(bets){
        res.render('picks', {wagers: wagers, user: req.user, bets: bets})
      })
    } else {
      res.render('picks', {wagers: wagers, user: req.user})
    }
  })
})

router.post('/submit', function(req, res, next){
  Wagers().insert({
    username: req.body.user,
    event: req.body.event,
    wager: req.body.wager,
    odds: req.body.odds,
    risk: req.body.risk,
    to_win: req.body.toWin,
    type: req.body.type
  }).then(function(){
    Users().select('balance').where({username: req.body.user})
    .then(function(userBal){
      var oldBal = userBal[0].balance;
      var newBal = oldBal - req.body.risk;
      Users().where({username: req.body.user}).update({balance: newBal}).then(function(){
        res.json({
          newBal: newBal
        });
      })
    })
  })
})

module.exports = router;
