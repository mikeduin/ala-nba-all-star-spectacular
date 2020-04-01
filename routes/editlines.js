const express = require('express');
const router = express.Router();
const knex = require('../db/knex')
const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');
const mainDb = knex.mainDb;

function Wagers () {
  return mainDb('wagers')
}

function Lines () {
  return mainDb('lines')
}

router.get('/all/:year', async (req, res, next) => {
  const maxyear = moment().year();
  const lines = await Lines().where({season: req.params.year}).orderBy('id');
  res.render('editlines', {lines, year: req.params.year, maxyear})
})

router.post('/grade', async (req, res, next) => {
  const id = req.body.id;
  let result, payout, grade = req.body.grade;
  grade === 'win' ? result = true : result = false;
  await Lines().where('id', id).update({result: result});
  Wagers().where('api_id', id).then(wagers => {
    for (let i=0; i<wagers.length; i++){
      const risk = wagers[i].risk;
      const win = wagers[i].to_win;
      const betId = wagers[i].api_id;
      const wagerId = wagers[i].id;
      result === true ? payout = win : payout = -risk;
      Wagers().where('id', wagerId).update({
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
