#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Originally used commander.js and cheerio, but simplified here to avoid
external dependencies. Demonstrates basic command line application
development and simple HTML parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
// Dependencies such as commander and cheerio are unavailable in this
// environment. Implement minimal replacements so the script can run
// without external modules.
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_FILE = "tmp.html";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var readHtmlFile = function(htmlfile) {
    return fs.readFileSync(htmlfile, 'utf8');
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    var html = readHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    checks.forEach(function(check) {
        var present = false;
        if (check.startsWith('.')) {
            var cls = check.slice(1);
            var classRegex = new RegExp('class=["\'](?:[^"\']*?\\s)?' + cls + '(?:\\s[^"\']*)?["\']', 'i');
            present = classRegex.test(html);
        } else {
            var tagRegex = new RegExp('<' + check + '(\\s|>)', 'i');
            present = tagRegex.test(html);
        }
        out[check] = present;
    });
    return out;
};

var parseArgs = function(argv) {
    var args = { checks: CHECKSFILE_DEFAULT, file: HTMLFILE_DEFAULT, url: null };
    for (var i = 2; i < argv.length; i++) {
        var arg = argv[i];
        if (arg === '-c' || arg === '--checks') {
            args.checks = argv[++i];
        } else if (arg === '-f' || arg === '--file') {
            args.file = argv[++i];
        } else if (arg === '-u' || arg === '--url') {
            args.url = argv[++i];
        }
    }
    return args;
};

var fetchUrl = function(url, callback) {
    var protocol = url.startsWith('https') ? require('https') : require('http');
    protocol.get(url, function(res) {
        var data = '';
        res.on('data', function(chunk) { data += chunk; });
        res.on('end', function() { callback(null, data); });
    }).on('error', function(err) { callback(err); });
};

if (require.main === module) {
    var options = parseArgs(process.argv);
    if (options.url) {
        fetchUrl(options.url, function(err, data) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            fs.writeFileSync(URL_FILE, data);
            var checkJson = checkHtmlFile(URL_FILE, options.checks);
            console.log(JSON.stringify(checkJson, null, 4));
            fs.writeFileSync(URL_FILE, '');
        });
    } else {
        var checkJson = checkHtmlFile(options.file, options.checks);
        console.log(JSON.stringify(checkJson, null, 4));
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
