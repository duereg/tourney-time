var pods, roundRobin;

roundRobin = require('./round-robin');

pods = require('./pods');

module.exports = function(teams) {
  if (teams > 8) {
    return {
      type: 'pods',
      games: pods(teams)
    };
  } else {
    return {
      type: 'round robin',
      games: roundRobin(teams)
    };
  }
};
