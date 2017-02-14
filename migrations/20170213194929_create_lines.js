
exports.up = function(knex, Promise) {
  return knex.schema.createTable('lines', function(t){
    t.increments();
    t.string('event');
    t.string('time');
    t.string('type');
    t.string('side');
    t.float('odds');
    t.boolean('result');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('lines');
};
