var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Wagers() {
  return knex('wagers');
}

function Users() {
  return knex('users');
}

router.get('/', function(req, res, next){
  var resObj = {};
  var photoObj = {};
  Users().select('username', 'photo').then(function(photos){
    for (var i=0; i<photos.length; i++) {
      photoObj[photos[i].username] = photos[i].photo
    };
    Wagers().select('username', 'event').sum('net_total').groupBy('username', 'event').orderBy('event').then(function(results){
      for (var i=0; i<results.length; i++) {
        if (resObj[results[i].username] === undefined) {
          resObj[results[i].username] = {
            "Rising Stars Game": 0,
            "Skills Challenge": 0,
            "Three-Point Contest": 0,
            "Dunk Contest": 0,
            "All-Star Game": 0,
            "TOTAL": 0,
          };
          resObj[results[i].username][results[i].event] = parseInt(results[i].sum);
          resObj[results[i].username]["TOTAL"] += parseInt(results[i].sum);
        } else {
          resObj[results[i].username][results[i].event] = parseInt(results[i].sum);
          resObj[results[i].username]["TOTAL"] += parseInt(results[i].sum);
        }
      };
      var sortedRes = [];
      for (var key in resObj) {
        sortedRes.push({username: key, photo: photoObj[key], rising_stars: resObj[key]["Rising Stars Game"], skills: resObj[key]["Skills Challenge"], three_pt: resObj[key]["Three-Point Contest"], dunk: resObj[key]["Dunk Contest"], all_star: resObj[key]["All-Star Game"], total: resObj[key]["TOTAL"]})
      };
      sortedRes.sort(function(x, y){return y.total - x.total});
      res.render('results', {results: sortedRes});
    })
  })
})

router.get('/mypicks', function(req, res, next){
  var user = req.user;
  
})

module.exports = router;
