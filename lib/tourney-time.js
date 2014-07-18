var playoffGamesCalculator, regularGamesCalculator, timeNeededCalculator;

regularGamesCalculator = require('regular/round-robin');

playoffGamesCalculator = require('playoffs/knockout');

timeNeededCalculator = require('timing/standard');

module.exports = function(_arg) {
  var areas, playoffGames, regularGames, rest, teams, time, timeNeeded;
  teams = _arg.teams, time = _arg.time, rest = _arg.rest, areas = _arg.areas;
  if (teams < 2) {
    throw new Error("You must have at least two teams to continue");
  }
  regularGames = regularGamesCalculator(teams);
  playoffGames = playoffGamesCalculator(teams);
  timeNeeded = timeNeededCalculator({
    regularGames: regularGames,
    playoffGames: playoffGames,
    gameTime: time,
    restTime: rest,
    areas: areas
  });
  return {
    regularGames: regularGames,
    playoffGames: playoffGames,
    timeNeededMinutes: timeNeeded
  };
};
