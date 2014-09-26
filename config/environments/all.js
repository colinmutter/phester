var fs = require('fs'),
  envcfg = require('envcfg');

module.exports = function (done) {
  // Use envcfg instead.
  var configFile = __dirname + '/../config.js';

  if (!fs.existsSync(configFile)) {
    console.error(
      'No configuration found at ' + configFile +
      '.  Copy /config/config.js.defaults to /config/config.js to fix.'
    );
    process.exit(-1);
  }

  this.config = envcfg(configFile);
}