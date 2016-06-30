var path = require('path');
var spawn = require('child_process').spawn;

var filepath = path.resolve('node_modules', 'assets-frontend');

var build = spawn('./server.sh', ['build'], {
  cwd: filepath
});

build.stdout.on('data', function(data) {
  process.stdout.write(data.toString());
});

build.stderr.on('data', function(data) {
  process.stdout.write(data.toString());
});
