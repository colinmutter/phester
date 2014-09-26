/*

  Creates a temp code file and runs it in PHP

  example question record
  {
    functionName: 'main($a, $b)',
    testInputs: [
      {"$a": 10, "$b": 4, "result": 14, "msg": "10 + 4 = 14"}
    ]
  }

  testing with:
  POST /answers/run HTTP/1.1
  Host: localhost:3000
  Cache-Control: no-cache
  Content-Type: application/x-www-form-urlencoded

  questionId=1&userId=2&input=function+main(%24a%2C+%24b)+%7B+return+%24a+-+%24b%3B+%7D&testInputs=%5B+++++%7B%22%24a%22%3A+123%2C+%22%24b%22%3A+456%2C+%22%24c%22%3A+567%2C+%22results%22%3A+false%2C+%22msg%22%3A+%22Testing+123%22%7D+++%5D

*/
var temp = require('temp-write'),
  fs = require('fs'),
  util = require('util'),
  exec = require('child_process').exec,
  crypto = require('crypto'),
  config = require('envcfg')(__dirname + '/../config/config.js');

module.exports = function (input, func, tests, cb) {

  var secretKey = crypto.randomBytes(24).toString("base64");
  var content = buildContent(input, func, tests, secretKey);

  // Generate temp file
  temp(content, function (err, path) {
    if (err) {
      return cb(err);
    }
    else {
      exec(config.bins.php + ' -f ' + path, function (err, stdout,
        stderr) {

        // Remove the temp file path from any errors
        var output = stdout.trim().replace(new RegExp(path, 'mig'),
          'your code').replace(new RegExp('/private', 'mig'), '');
        var errors = stderr.trim().replace(new RegExp(path, 'mig'),
          'your code').replace(new RegExp('/private', 'mig'), '');

        // Determine if this is passing code or not and return
        var decision = interpretResults(output, errors);

        // Remove secret key
        decision.output = decision.output.replace(secretKey, '');

        // If we want to show the generated code to the user, return that here..
        if (config.test.showGenCode) {
          decision.inputOrig = content;
        }
        else {
          decision.inputOrig = 'enable config.test.showGenCode to see this';
        }

        // Send it all back
        cb(null, decision);
      });
    }
  });

};

function buildContent(input, func, tests, secretKey) {

  // Strip php tags and re-add our own
  var content = util.format('<?php\n%s',
    input
    .replace(/<\?(php)?/, '', 'mig')
    .replace(/\?>/, '', 'mig')
  );

  // Add assertions for user test cases
  content += '\n\n\n/* Internal Assertions: */';

  for (var i = 0, j = tests.length; i < j; i++) {
    var test = tests[i];

    // Prep func template
    for (var param in test) {
      if (param === 'result' || param === 'msg') continue;

      // Get the test input values
      var paramVal = 0;
      try {
        var paramVal = JSON.stringify(test[param]);
      }
      catch (e) {
        console.error(e);
      }
      // Export the test input values to the native lang
      content += util.format(
        '\n%s = json_decode(\'%s\', true);',
        param,
        paramVal);
    }

    // Get the expected value
    var expected = 0;
    try {
      expected = JSON.stringify(test.result);
    }
    catch (e) {
      console.error(e);
    }

    // Export the expected value
    content += util.format('\n$result = json_decode(\'%s\', true);', expected);

    // Add our assertions to the file
    content += util.format('\nassert(%s === $result, "%s");', func, test.msg);
  }

  content += util.format('\n\n/* Completion Key */\necho "%s";', secretKey);
  return content;
}

function interpretResults(output, error, secretKey) {
  var decision = {
    isSuccessful: true,
    output: output,
    error: error
  };

  // @TODO better error detection and smarter response messages
  if (error.length > 0 || output.match(/Warning|Error/i) || output.match(
    /assert\(\)\: .* failed in your code/i) || !output.match(secretKey)) {
    decision.isSuccessful = false;
    decision.output = decision.output.replace(/\n|\r\n/mig, ' ').replace(
      /call stack.*/igm, '');
    decision.error = decision.error.replace(/\n|\r\n/mig, ' ').replace(
      /php stack trace.*/igm, '');
  }

  return decision;
}