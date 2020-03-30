const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile.js')[environment];
const config_users = require('../knexfile_users.js')[environment];

module.exports = {
  mainDb: require('knex')(config),
  userDb: require('knex')(config_users)
}
