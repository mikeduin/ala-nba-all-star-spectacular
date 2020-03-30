const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');
const userDb = knex.userDb;
const mainDb = knex.mainDb;

function Wagers() {
  return mainDb('wagers');
}

function UserSeasons() {
  return mainDb('user_seasons');
}

function Lines() {
  return mainDb('lines');
}

router.get('/', async (req, res, next) => {
  const user = Array.isArray(req.user) ? req.user[0] : req.user;
  const lines = await Lines().orderBy('time').orderBy('id');
    if (user) {
      const userData = await UserSeasons().where({username: user.username}).select('balance', 'asg', 'threept', 'skills', 'dunk');
      const { balance, asg, dunk, skills, threept } = userData[0];
      const bets = await Wagers().select('event', 'wager', 'odds', 'risk', 'net_total').where({username: user.username}).orderBy('event');
      res.render('picks', {wagers: lines, user, bets, balance, asgBal: asg, dunkBal: dunk, skillsBal: skills, threeptBal: threept});
    } else {
      res.render('picks', {wagers: lines, user})
    }
})

router.post('/submit', function(req, res, next){
  const event = req.body.event;
  const risk = parseInt(req.body.risk);
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
    UserSeasons().select('balance', 'asg', 'threept', 'skills', 'dunk').where({username: req.body.user})
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
      UserSeasons().where({username: req.body.user}).update({balance: newBal, asg: asgBal, dunk: dunkBal, skills: skillsBal, threept: threeptBal}).then(function(){
        res.json({newBal, asgBal, dunkBal, skillsBal, threeptBal});
      })
    })
  })
})

module.exports = router;
