const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let user = Array.isArray(req.user) ? req.user[0] : req.user;
  // console.log('user is ', req.user);
  res.render('index', { title: "ALA's NBA All-Star Spectacular", user: user });
});

module.exports = router;
