const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');
const userDb = knex.userDb;
const mainDb = knex.mainDb;

function Wagers() {
  return knex('wagers');
}

function Users() {
  return knex('users');
}

function Lines() {
  return knex('lines');
}

router.get('/', function(req, res, next){
  var user = req.user;
  Lines().orderBy('time').orderBy('id').then(function(lines){
    if (user) {
      Users().select('balance', 'asg', 'threept', 'skills', 'dunk').where({username: user.username}).then(function(userData){
        var bal = userData[0].balance;
        var asgBal = userData[0].asg;
        var dunkBal = userData[0].dunk;
        var skillsBal = userData[0].skills;
        var threeptBal = userData[0].threept;
        Wagers().select('event', 'wager', 'odds', 'risk', 'net_total').where({username: user.username}).orderBy('event').then(function(bets){
          res.render('picks', {wagers: lines, user: req.user, bets: bets, balance: bal, asgBal: asgBal, dunkBal: dunkBal, skillsBal: skillsBal, threeptBal: threeptBal})
        })
      })
    } else {
      res.render('picks', {wagers: lines, user: req.user})
    }
  })
})

router.post('/submit', function(req, res, next){
  var event = req.body.event;
  var risk = parseInt(req.body.risk);
  Wagers().insert({
    username: req.body.user,
    event: event,
    wager: req.body.wager,
    odds: req.body.odds,
    risk: risk,
    to_win: req.body.toWin,
    api_id: req.body.api_id,
    start_time: req.body.time,
    type: req.body.type
  }).then(function(){
    Users().select('balance', 'asg', 'threept', 'skills', 'dunk').where({username: req.body.user})
    .then(function(userData){
      var oldBal = userData[0].balance;
      var asgBal = parseInt(userData[0].asg);
      var dunkBal = parseInt(userData[0].dunk);
      var skillsBal = parseInt(userData[0].skills);
      var threeptBal = parseInt(userData[0].threept);
      var newBal = oldBal - risk;
      event === 'Skills Challenge' ? skillsBal += risk : null;
      event === 'Three-Point Contest' ? threeptBal += risk : null;
      event === 'Dunk Contest' ? dunkBal += risk : null;
      event === 'All-Star Game' ? asgBal += risk: null;
      Users().where({username: req.body.user}).update({balance: newBal, asg: asgBal, dunk: dunkBal, skills: skillsBal, threept: threeptBal}).then(function(){
        res.json({
          newBal: newBal,
          asgBal: asgBal,
          dunkBal: dunkBal,
          skillsBal: skillsBal,
          threeptBal: threeptBal
        });
      })
    })
  })
})

module.exports = router;
