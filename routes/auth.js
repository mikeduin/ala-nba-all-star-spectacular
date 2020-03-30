const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const knex = require('../db/knex');
const passport = require('passport');
const userDb = knex.userDb;

function Users () {
  return userDb('users');
}

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get(
  '/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect('/');
  }
);

router.post('/login', (req, res, next) => {
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'You forgot to include either your username or your password!'});
  };
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err) }
    if (user) {
    // THIS FUNCTION WAS NEEDED TO CALL SERIALIZE USER!!
    // console.log('user in authenticate is ', user);
    req.logIn(user, function(err) {
             if (err) { return res.send(err); }
             res.redirect('/');
          });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

router.post('/register', async (req, res, next) => {
  var salt = crypto.randomBytes(16).toString('hex');
  var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, 'sha512').toString('hex');

  const usernames = await Users().pluck('username');
  if (usernames.indexOf(req.body.username) !== -1) {
    console.log('username already taken');
    return res.status(400).json({message: 'This username has already been taken.'});
  }
  const emails = await Users().pluck('email');
  if (emails.indexOf(req.body.email) !== -1) {
    console.log('email already taken');
    return res.status(400).json({message: 'This email is already in use.'});
  }

  let photoUrl = req.body.profilePhoto || null;
  let bonus = req.body.bonus || 0;

  let increment = 0;
  const idFetch = await Users().max('id');
  increment = idFetch[0].max + 1;
  Users().insert({
    id: increment,
    username: req.body.username,
    nameFirst: req.body.nameFirst,
    nameLast: req.body.nameLast,
    email: req.body.email,
    photo_url: photoUrl,
    registered: new Date(),
    salt: salt,
    hash: hash,
  }, '*').then(newUser => {
    console.log(newUser[0].username, ' has been added to the DB');
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (user) {
      // THIS FUNCTION WAS NEEDED TO CALL SERIALIZE USER!!
      // console.log('user in authenticate is ', user);
      req.logIn(user, function(err) {
               if (err) { return res.send(err); }
               res.redirect('/');
            });
      } else {
        return res.status(401).json(info);
      }
    })(req, res, next);
  })
})

router.get('/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email', 'user_hometown']})
);

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/logout', function(req, res){
  req.logOut();
  req.session = null;
  res.redirect('back');
});

module.exports = router;
