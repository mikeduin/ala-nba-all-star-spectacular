// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: process.env.MAIN_DB_URI
  },

  production: {
    client: 'pg',
    connection: process.env.MAIN_DB_URI
  }

};
