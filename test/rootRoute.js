const http = require('http');
const fs = require('fs');
const {spawn} = require('child_process');

const port = 5000;
const server = spawn('node', ['web.js'], {
  env: Object.assign({}, process.env, {PORT: port}),
  stdio: ['ignore', 'pipe', 'pipe']
});

let output = '';
server.stdout.on('data', (data) => { output += data.toString(); });
server.stderr.on('data', (data) => { output += data.toString(); });

function shutdown(exitCode) {
  server.kill();
  setTimeout(() => process.exit(exitCode), 500);
}

function runTest() {
  http.get({host: 'localhost', port: port, path: '/'}, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      const expected = fs.readFileSync('index.html', 'utf8');
      if (body === expected) {
        console.log('Root route serves index.html');
        shutdown(0);
      } else {
        console.error('Root route did not serve expected content');
        shutdown(1);
      }
    });
  }).on('error', (err) => {
    console.error('HTTP request failed', err);
    shutdown(1);
  });
}

setTimeout(runTest, 1000);
