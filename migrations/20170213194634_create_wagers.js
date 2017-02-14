
exports.up = function(knex, Promise) {
  return knex.schema.createTable('wagers', function(t){
    t.increments();
    t.string('username');
    t.string('event');
    t.string('wager');
    t.float('odds');
    t.float('risk');
    t.float('to_win');
    t.boolean('result');
    t.float('net_total').defaultTo(0);
    t.string('type');
    t.string('start_time');
    t.integer('api_id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('wagers');
};
