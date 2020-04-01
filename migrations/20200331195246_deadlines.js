exports.up = function(knex) {
  return knex.schema.createTable('deadlines', t => {
    t.increments();
    t.integer('season');
    t.timestamp('reg');
    t.timestamp('rising_stars');
    t.timestamp('skills');
    t.timestamp('three_pt');
    t.timestamp('dunk');
    t.timestamp('asg');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('deadlines');
};
