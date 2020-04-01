const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const mainDb = knex.mainDb;
const userDb = knex.userDb;

function Wagers() {
  return mainDb('wagers');
}

function UserSeasons() {
  return mainDb('user_seasons');
}

function Deadlines () {
  return mainDb('deadlines');
}

router.get('/:season', async (req, res, next) => {
  var resObj = {};
  var photoObj = {};
  const seasons = await Deadlines().pluck('season');
  UserSeasons().where({season: req.params.season}).then(function(users){
    for (var i=0; i<users.length; i++) {
      var wag_rs = 1000 - users[i].balance - users[i].threept - users[i].dunk - users[i].skills - users[i].asg;
      photoObj[users[i].username] = {};
      photoObj[users[i].username]['photo'] = users[i].photo;
      photoObj[users[i].username]['wag_threept'] = users[i].threept;
      photoObj[users[i].username]['wag_dunk'] = users[i].dunk;
      photoObj[users[i].username]['wag_asg'] = users[i].asg;
      photoObj[users[i].username]['wag_skills'] = users[i].skills;
      photoObj[users[i].username]['wag_rs'] = wag_rs;
    };
    Wagers()
      .where({season: req.params.season})
      .select('username', 'event')
      .sum('net_total')
      .groupBy('username', 'event')
      .orderBy('event')
      .then(function(results){
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
        sortedRes.push({username: key, photo: photoObj[key]['photo'], rising_stars: rsTotal, skills: skTotal, three_pt: tpTotal, dunk: dunkTotal, all_star: asgTotal, total: total, wag_rs: photoObj[key]['wag_rs'], wag_skills: photoObj[key]['wag_skills'], wag_threept: photoObj[key]['wag_threept'], wag_dunk: photoObj[key]['wag_dunk'], wag_asg: photoObj[key]['wag_asg']})
      };
      sortedRes.sort(function(x, y){return y.total - x.total});
      res.render('results', {results: sortedRes, seasons, year: req.params.season});
    })
  })
})

module.exports = router;
