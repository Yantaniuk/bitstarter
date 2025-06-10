const assert = require('assert');
const grader = require('../grader.js');
const path = require('path');
const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');

const testHtml = path.join(__dirname, 'test.html');
const testChecks = path.join(__dirname, 'test-checks.json');

const expected = { h1: true, p: true, div: false };
const result = grader.checkHtmlFile(testHtml, testChecks);

assert.deepStrictEqual(result, expected);

const missingHtml = path.join(__dirname, 'test-missing.html');
const expectedMissing = { h1: false, p: false, div: false };
const resultMissing = grader.checkHtmlFile(missingHtml, testChecks);

assert.deepStrictEqual(resultMissing, expectedMissing);

const server = http.createServer((req, res) => {
  if (req.url === '/missing') {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(fs.readFileSync(testHtml));
});

server.listen(0, () => {
  const port = server.address().port;
  const url = `http://localhost:${port}`;
  const graderPath = path.join(__dirname, '..', 'grader.js');
  const cmd = `node ${graderPath} -c ${testChecks} -u ${url}`;
  const output = execSync(cmd);
  const urlResult = JSON.parse(output.toString());
  assert.deepStrictEqual(urlResult, expected);

  try {
    execSync(`node ${graderPath} -c ${testChecks} -u ${url}/missing`);
    assert.fail('Expected command to fail');
  } catch (err) {
    assert.ok(err.status !== 0);
  }

  try {
    execSync(`node ${graderPath} -c ${testChecks} -u http://localhost:65530/`);
    assert.fail('Expected command to fail');
  } catch (err) {
    assert.ok(err.status !== 0);
  }

  server.close();

  console.log('All tests passed.');
});
