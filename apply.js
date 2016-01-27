var turf = require('turf');

module.exports = function(data, worker) {
  var argv = worker.userOptions.argv;
  var args = argv.args;
  var fn = turf[argv.method];
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
