const express = require('express');
const router = express.Router();
const moment = require('moment');
const year = moment().year();

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = Array.isArray(req.user) ? req.user[0] : req.user;
  res.render('index', { title: "ALA's NBA All-Star Spectacular", user, year });
});

module.exports = router;
