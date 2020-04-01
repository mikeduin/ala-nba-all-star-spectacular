const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const mainDb = knex.mainDb;
const userDb = knex.userDb;

function Wagers () {
  return mainDb('wagers')
}

function Deadlines () {
  return mainDb('deadlines')
}

router.get('/:season', async (req, res, next) => {
  const wagers = await Wagers().where({season: req.params.season}).orderBy('username');
  // const seasons = await Deadlines().pluck('season');
  const seasons = [2017, 2020];
  const users = await Wagers().where({season: req.params.season}).distinct('username').orderBy('username');
  res.render('allpicks', {wagers, users, seasons, year: req.params.season});
})

router.get('/user/all/event/all/:season', async (req, res, next) => {
  const wagers = await Wagers().where({season: req.params.season}).orderBy('username');
  res.json({wagers})
})

router.get('/user/:user/event/all/:season', async (req, res, next) => {
  const user = req.params.user;
  const wagers = await Wagers().where({username: user, season: req.params.season});
  res.json({wagers});
})

router.get('/user/all/event/:event/:season', async (req, res, next) => {
  const event = req.params.event;
  const wagers = await Wagers().where({event: event, season: req.params.season}).orderBy('username');
  res.json({wagers});
})

router.get('/user/:user/event/:event/:season', async (req, res, next) => {
  const user = req.params.user;
  const event = req.params.event;
  const wagers = await Wagers().where({username: user, event: event, season: req.params.season});
  res.json({wagers});
})

module.exports = router;
