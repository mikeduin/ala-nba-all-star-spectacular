var environment = process.env.NODE_ENV || 'development';
var config = require('../knexfile.js')[environment];
const config_users = require('../knexfile_users.js')[environment];

module.exports = {
  mainDb: require('knex')(config),
  userDb: require('knex')(config_users)
}
