module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.USERS_DB_URI
  },

  production: {
    client: 'postgresql',
    connection: process.env.USERS_DB_URI
  }
};
