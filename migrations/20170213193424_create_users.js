
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(t){
    t.increments();
    t.string('email');
    t.string('username');
    t.string('first_name');
    t.string('last_name');
    t.string('hometown');
    t.string('fb_profile');
    t.string('facebookid');
    t.string('photo');
    t.boolean('superuser');
    t.float('balance');
    t.float('asg').defaultTo(0);
    t.float('dunk').defaultTo(0);
    t.float('threept').defaultTo(0);
    t.float('skills').defaultTo(0);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
