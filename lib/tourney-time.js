var playoffGamesCalculator, scheduleGenerator, timeNeededCalculator, tourneyTypeSelector;

tourneyTypeSelector = require('tourney/selector');

playoffGamesCalculator = require('playoffs/duel');

timeNeededCalculator = require('timing/standard');

scheduleGenerator = require('schedule/generator');

module.exports = function(_arg) {
  var areas, playoffGames, rest, schedule, teams, time, timeNeeded, tourneySchedule;
  teams = _arg.teams, time = _arg.time, rest = _arg.rest, areas = _arg.areas;
  if (teams < 2) {
    throw new Error("You must have at least two teams to continue");
  }
  tourneySchedule = tourneyTypeSelector(teams);
  playoffGames = playoffGamesCalculator(teams);
  timeNeeded = timeNeededCalculator({
    tourneyGames: tourneySchedule.games,
    playoffGames: playoffGames.length,
    gameTime: time,
    restTime: rest,
    areas: areas
  });
  schedule = scheduleGenerator({
    tourneySchedule: tourneySchedule,
    playoffGames: playoffGames.length,
    areas: areas
  });
  delete tourneySchedule.schedule;
  return {
    tourneySchedule: tourneySchedule,
    playoffGames: playoffGames.length,
    timeNeededMinutes: timeNeeded,
    schedule: schedule
  };
};
