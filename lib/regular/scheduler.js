var pods, roundRobin;

roundRobin = require('./round-robin');

pods = require('./pods');

module.exports = function(teams) {
  var tourney;
  if (teams > 8) {
    return {
      type: 'pods',
      games: pods(teams)
    };
  } else {
    tourney = roundRobin(teams);
    return {
      type: 'round robin',
      games: tourney.games
    };
  }
};
