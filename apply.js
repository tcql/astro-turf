var path = require('path');
global.turf = require('turf');
global.tilebelt = require('tilebelt');
global.tilecover = require('tile-cover');

var fn;

module.exports = function(data, worker) {
  var argv = worker.userOptions.argv;
  var args = argv.args;

  if (!fn) {
    if (argv.method) {
      fn = global.turf[argv.method];
    } else if (argv.map) {
      fn = require(path.resolve(argv.map));
    }

    // allow a noop print method
    if (argv.method === 'print') {
      fn = function (geom) { return geom; };
    }
  }

  var json = JSON.parse(new Buffer(data).toString());
  var queue = [json];
  if (argv.splitCollections && typeof json === 'object' && json.features) {
    queue = json.features;
  }

  for (var q = 0; q < queue.length; q++) {
    var locArgs = args.slice();
    for (var i = 0; i < argv.placeholders.length; i++) {
      locArgs[argv.placeholders[i]] = queue[q];
    }

    worker.push(fn.apply(fn, locArgs));
  }

  worker.done();
};
