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
      for (var key in photoObj) {
        var rsTotal, skTotal, tpTotal, dunkTotal, asgTotal, total;
        if (resObj[key] === undefined) {
          rsTotal = 0
          skTotal = 0;
          tpTotal = 0;
          dunkTotal = 0;
          asgTotal = 0;
          total = 0
        } else {
          rsTotal = resObj[key]["Rising Stars Game"];
          skTotal = resObj[key]["Skills Challenge"];
          tpTotal = resObj[key]["Three-Point Contest"];
          dunkTotal = resObj[key]["Dunk Contest"];
          asgTotal = resObj[key]["All-Star Game"];
          total = resObj[key]["TOTAL"];
        };
        sortedRes.push({username: key, photo: photoObj[key], rising_stars: rsTotal, skills: skTotal, three_pt: tpTotal, dunk: dunkTotal, all_star: asgTotal, total: total})
      };
      sortedRes.sort(function(x, y){return y.total - x.total});
      res.render('results', {results: sortedRes});
    })
  })
})

module.exports = router;
