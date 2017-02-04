var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('user is ', req.user);
  res.render('index', { title: "ALA's NBA All-Star Spectacular", user: req.user });
});

module.exports = router;
