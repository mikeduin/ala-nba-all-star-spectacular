// can prob delete this as this same info is in app.ks

module.exports = {
  'facebookAuth' : {
    'clientID' : process.env.FB_APP_ID,
    'clientSecret' : process.env.FB_APP_SECRET,
    'callbackURL' : 'http://localhost:3000/auth/facebook/callback'
  }
}
