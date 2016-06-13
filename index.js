/* eslint-disable */
var nodeVersion = parseInt(process.versions.node.split('.')[0], 10);
module.exports = require(nodeVersion >= 6 ? './src' : './lib');
