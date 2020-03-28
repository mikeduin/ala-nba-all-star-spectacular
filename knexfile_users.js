// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: process.env.USERS_DB_URI
  },

  production: {
    client: 'pg',
    connection: process.env.USERS_DB_URI
  }

};
