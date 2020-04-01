exports.up = function(knex) {
  return knex.schema.createTable('deadlinestz', t => {
    t.increments();
    t.integer('season');
    t.timestamptz('reg');
    t.timestamptz('rising_stars');
    t.timestamptz('skills');
    t.timestamptz('three_pt');
    t.timestamptz('dunk');
    t.timestamptz('asg');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('deadlinestz');
};
