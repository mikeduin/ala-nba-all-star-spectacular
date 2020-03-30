const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const mainDb = knex.mainDb;
const userDb = knex.userDb;

function Wagers () {
  return mainDb('wagers')
};

router.get('/', async (req, res, next) => {
  const wagers = await Wagers().orderBy('username');
  const users = await Wagers().distinct('username').select().orderBy('username');
  res.render('allpicks', {wagers: wagers, users: users});
})

router.get('/user/all/event/all', async (req, res, next) => {
  const wagers = await Wagers().orderBy('username');
  res.json({wagers: wagers})
})

router.get('/user/:user/event/all', async (req, res, next) => {
  const user = req.params.user;
  const wagers = await Wagers().where({username: user});
  res.json({wagers: wagers});
})

router.get('/user/all/event/:event', async (req, res, next) => {
  const event = req.params.event;
  const wagers = await Wagers().where({event: event}).orderBy('username');
  res.json({wagers: wagers});
})

router.get('/user/:user/event/:event', async (req, res, next) => {
  const user = req.params.user;
  const event = req.params.event;
  const wagers = await Wagers().where({username: user, event: event});
  res.json({wagers: wagers});
})

module.exports = router;
