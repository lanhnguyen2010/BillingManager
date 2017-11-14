var pg = require('pg');
var dbUser = "billing";
var database = "billing";
var connectionString = "postgres://billing:@localhost:5432/billing";

//this initializes a connection pool
//it will keep idle connections open for a (configurable) 30 seconds
//and set a limit of 20 (also configurable)
pg.connect(connectionString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].number);
    //output: 1
  });
  var query = client.query('CREATE TABLE IF NOT EXISTS goods(id SERIAL PRIMARY KEY, name VARCHAR(200) not null, producer VARCHAR(100), unit VARCHAR(20), weight VARCHAR(20), price BIGINT)',  function(err2, result){

  done();
      if(err2) {
        return console.error('error running query', err2);
      }
  console.log('done');
  });

});
pg.end();