const assert = require('assert');
const grader = require('../grader.js');
const path = require('path');

const testHtml = path.join(__dirname, 'test.html');
const testChecks = path.join(__dirname, 'test-checks.json');

const expected = { h1: true, p: true, div: false };
const result = grader.checkHtmlFile(testHtml, testChecks);

assert.deepStrictEqual(result, expected);

const missingHtml = path.join(__dirname, 'test-missing.html');
const expectedMissing = { h1: false, p: false, div: false };
const resultMissing = grader.checkHtmlFile(missingHtml, testChecks);

assert.deepStrictEqual(resultMissing, expectedMissing);

console.log('All tests passed.');
