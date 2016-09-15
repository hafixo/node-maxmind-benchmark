var path = require('path');

function randip() {
  return Math.ceil(Math.random() * 254) + '.' +
    Math.ceil(Math.random() * 254) + '.' +
    Math.ceil(Math.random() * 254) + '.' +
    Math.ceil(Math.random() * 254);
}


var DB_FILE = path.join(__dirname, '/GeoLite2-City.mmdb');


var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();
suite.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
});


/******************* maxmind ***********************/
var my = require('maxmind').open(DB_FILE);

suite.add('maxmind', {
  minSamples: 50,
  fn: function() {
    my.get(randip());
  }
});

/***************** mmdb-reader *********************/
var MMDBReader = require('mmdb-reader')(DB_FILE);

suite.add('mmdb-reader', {
  minSamples: 50,
  fn: function() {
    MMDBReader.lookup(randip());
  }
});

/************* maxmind-db-reader *******************/
var mmdbreader = require('maxmind-db-reader').openSync(DB_FILE);

suite.add('maxmind-db-reader', {
  minSamples: 50,
  fn: function() {
    mmdbreader.getGeoDataSync(randip());
  }
});

/******************* geoip2  ***********************/
var geoip2 = require('geoip2').init(DB_FILE);

suite.add('geoip2', {
  minSamples: 50,
  fn: function() {
    geoip2.lookupSync(randip());
  }
});

/******************* jgeoip  ***********************/
var jgeoip = new (require('jgeoip'))(DB_FILE);

suite.add('jgeoip', {
  minSamples: 50,
  fn: function() {
    jgeoip.getRecord(randip());
  }
});


suite.run();
