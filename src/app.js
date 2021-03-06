'use strict';

var config = require('./config');
var jenkins = require('./jenkins');
var hwAddr = config.button.hwAddr;

if (!hwAddr) {
  console.log('Specify the hardware address of your Dash Button with HW_ADDR env variable');
  process.exit(0);
}

var dashButton = require('node-dash-button');
var dash;

try {
  dash = dashButton(hwAddr);
} catch (err) {
  console.log(err.message);
  process.exit(0);
}

dash.on('detected', function() {
  console.log('Button press detected');
  console.log('Building ' + config.jenkins.job + '...');
  jenkins.build(function(err) {
    if (err) {
      return console.error(err.message, err.stack);
    }
    console.log('Build complete');
  });
});

console.log('\nListening for device button press...');
