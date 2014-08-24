var pods, roundRobin;

roundRobin = require('./round-robin');

pods = require('./pods');

module.exports = function(teams, areas) {
  var areaLimit, tourney;
  if (teams > 8 && areas <= Math.floor(teams / 4)) {
    tourney = pods(teams);
    return {
      type: 'pods',
      games: tourney.games,
      schedule: tourney.schedule,
      areas: areas
    };
  } else {
    tourney = roundRobin(teams);
    areaLimit = Math.floor(teams / 2);
    if (areas > areaLimit) {
      areas = areaLimit;
    }
    return {
      type: 'round robin',
      games: tourney.games,
      schedule: tourney.schedule,
      areas: areas
    };
  }
};
