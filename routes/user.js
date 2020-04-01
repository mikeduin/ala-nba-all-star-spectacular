const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const mainDb = knex.mainDb;
const userDb = knex.userDb;
const moment = require('moment');

var checkLoggedIn = function(req, res, next) {
  if (!req.user) {
    res.redirect('/');
  }
  else {
    next();
  }
};

function Wagers() {
  return mainDb('wagers');
}

function UserSeasons() {
  return mainDb('user_seasons');
}

router.get('/register', async (req, res, next) => {
  const year = moment().year();
  const user = Array.isArray(req.user) ? req.user[0] : req.user;
  let userAdd = await UserSeasons().insert({
    username: user.username,
    season: year
  }, '*');
  console.log(`${userAdd[0].username} has been added to userSeasons for year ${userAdd[0].season}`);
  res.redirect(`/picks/${year}`);
})

router.get('/:username', async (req, res, next) => {
  Wagers().where('username', req.params.username).then(wagers => {
    res.render('user', {wagers: wagers})
  });
});

module.exports = router;
