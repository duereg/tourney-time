var pods, roundRobin;

roundRobin = require('./round-robin');

pods = require('./pods');

module.exports = function(teams) {
  var tourney;
  if (teams > 8) {
    tourney = pods(teams);
    return {
      type: 'pods',
      games: tourney.games,
      schedule: tourney.schedule
    };
  } else {
    tourney = roundRobin(teams);
    return {
      type: 'round robin',
      games: tourney.games,
      schedule: tourney.schedule
    };
  }
};
