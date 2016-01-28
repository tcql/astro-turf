#!/usr/bin/env node
var split = require('binary-split');
var through2 = require('through2');
var argv = require('minimist')(process.argv.slice(2));
var apply = require('./apply');
var multilove = require('multilove');
var xtend = require('xtend');

argv = xtend({
  args: '[$]',
  log: false,
  logInterval: 1000,
}, argv);

if (!argv.method) {
  console.error("--method is required");
  process.exit();
}

if (!argv.args) argv.args = '[$]';
if (argv.args[0] !== '[') argv.args = '[' + argv.args + ']';
var donect = 0;

report(0);

process.stdin
  .pipe(split())
  .pipe(getProcessor(argv.P))
  .pipe(through2.obj(function (chunk, enc, done) {
    report(++donect);
    if (!chunk) return done(); // Toss out empty chunks
    if (typeof chunk === 'object') chunk = JSON.stringify(chunk);
    done(null, chunk + '\n');
  }))
  .pipe(process.stdout)
  .on('error', function (e) {
    console.error(e);
  });

function report(total) {
  if (argv.log === true && total % argv.logInterval === 0) {
    process.stderr.clearLine();
    process.stderr.cursorTo(0);
    process.stderr.write((total / 1000000).toFixed(3) + ' million records');
  }
}

function getProcessor(isParallel) {
  if (!isParallel) {
    // If not using parallelization, process chunks inline
    return through2.obj(function (chunk, enc, done) {
      this.push(apply(chunk, {
        done: done,
        push: this.push.bind(this),
        userOptions: {argv: argv}
      }));
    });
  } else {
    return multilove({
      worker: __dirname + '/apply.js',
      workerOptions: {
        argv: argv
      }
    });
  }
}