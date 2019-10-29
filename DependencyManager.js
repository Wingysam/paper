module.exports = async () => {
  return {
    parseArgs: require('parseargs.js'),
    EventEmitter: require('events'),
    fs: require('fs').promises,
    lodash: require('lodash'),
    Enmap: require('enmap'),
    path: require('path'),
    YAML: require('yaml'),
    irc: require('irc')
  }
}