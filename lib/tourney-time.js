var playoffGamesCalculator, timeNeededCalculator, tourneyTypeSelector;

tourneyTypeSelector = require('tourney/selector');

playoffGamesCalculator = require('playoffs/knockout');

timeNeededCalculator = require('timing/standard');

module.exports = function(_arg) {
  var areas, playoffGames, rest, teams, time, timeNeeded, tourneySchedule;
  teams = _arg.teams, time = _arg.time, rest = _arg.rest, areas = _arg.areas;
  if (teams < 2) {
    throw new Error("You must have at least two teams to continue");
  }
  tourneySchedule = tourneyTypeSelector(teams);
  playoffGames = playoffGamesCalculator(teams);
  timeNeeded = timeNeededCalculator({
    tourneyGames: tourneySchedule.games,
    playoffGames: playoffGames,
    gameTime: time,
    restTime: rest,
    areas: areas
  });
  return {
    tourneySchedule: tourneySchedule,
    playoffGames: playoffGames,
    timeNeededMinutes: timeNeeded
  };
};
