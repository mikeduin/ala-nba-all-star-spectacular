const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const knex = require('../db/knex');
const crypto = require('crypto');
const userDb = knex.userDb;

function Users () {
  return userDb('users');
}

function checkPassword (user, password) {
  var hash = crypto.pbkdf2Sync(password, user[0].salt, 1000, 64, 'sha512').toString('hex');
  return user[0].hash === hash;
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let user = await Users().where({id: id});
  done(null, user);
});

passport.use(new LocalStrategy(async (username, password, done) => {
  let user = await Users().where({username: username});
  if (user.length === 0) {
    return done(null, false, {
      message: 'Username not found'
    });
  };
  if (!checkPassword(user, password)) {
    return done(null, false, {
      message: 'Password is incorrect'
    });
  };
  done(null, user[0]);
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {
    const googleEmail = profile.emails[0].value;
    const existingUser = await Users().where({
      googleId: profile.id
    }).orWhere({
      email: googleEmail
    });

    if (existingUser[0]) {
      // If user is in DB ...
      // check if photo exists
      if (!existingUser[0].photo_url) {
        let updatedUser = await Users()
          .where({id: existingUser[0].id})
          .update({photo_url: profile.photos[0].value}, '*');
        console.log('photo updated for ', updatedUser[0].username);
      };

      // check if Google ID exists
      if (!existingUser[0].googleId) {
        let updatedUser = await Users()
          .where({id: existingUser[0].id})
          .update({googleId: profile.id}, '*');
        console.log('googleId updated for ', updatedUser[0].username);
      }

      done(null, existingUser[0]);
    } else {
      // If user does not exist in DB
      const username = googleEmail.slice(0, googleEmail.indexOf('@'));

      let data = await Users().max('id');
      let increment = 0;
      let value = data[0].max;
      increment = value + 1;

      let user = await Users().insert({
        id: increment,
        username: username,
        email: googleEmail,
        nameFirst: profile.name.givenName,
        nameLast: profile.name.familyName,
        googleId: profile.id,
        photo_url: profile.photos[0].value,
        registered: new Date()
      }, '*');

      console.log(user, ' has been added to DB');
      done(null, user[0]);
    }
  })
);

// dev callback URI: 'http://localhost:3000/auth/facebook/callback'

passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FB_APP_ID,
    clientSecret: process.env.FB_APP_SECRET,
    // callbackURL: 'https://localhost:3000/auth/facebook/callback',
    callbackURL: 'https://nba-all-star-spectacular.herokuapp.com/auth/facebook/callback',
    profileFields: ['id', 'email', 'displayName', 'photos', 'first_name', 'last_name', 'hometown', 'link']
  },

  // facebook will send back the tokens + profile
  function(accessToken, refreshToken, profile, done) {
    var email = profile.emails[0].value;
    var username = email.split('@')[0];
    Users().where('email', email).then(function(user){
      if (!user) {
        Users().insert({
          email: email,
          username: username,
          nameFirst: profile._json.first_name,
          nameLast: profile._json.last_name,
          fb_profile: profile._json.link,
          facebookid: profile.id,
          photo_url: profile.photos[0].value,
          admin: false
        }, '*').then(function(user){
          done(null, user[0]);
        });
      } else {
        done(null, user);
      }
    })
  })
)
