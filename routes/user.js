const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const mainDb = knex.mainDb;
const userDb = knex.userDb;

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

router.get('/:username', async (req, res, next) => {
  Wagers().where('username', req.params.username).then(wagers => {
    res.render('user', {wagers: wagers})
  });
});

module.exports = router;
