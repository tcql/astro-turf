var turf = require('turf');
var path = require('path');

module.exports = function(data, worker) {
  var argv = worker.userOptions.argv;
  var args = argv.args;

  if (argv.method) {
    var fn = turf[argv.method];
  } else if (argv.map) {
    var fn = require(path.resolve(argv.map));
  }

  // allow a noop print method
  if (argv.method === 'print') {
    fn = function (geom) { return geom; };
  }

  var json = JSON.parse(new Buffer(data).toString());

  var queue = [json];
  if (argv.splitCollections && typeof json === 'object' && json.features) {
    queue = json.features;
  }

  queue.forEach(function (geometry) {
    // this is ugly; replace any $ with the geometry as a string
    var params = JSON.parse(args.replace('$', JSON.stringify(geometry)));
    worker.push(fn.apply(fn, params));
  });

  worker.done();
};
