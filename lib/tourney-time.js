var playoffGamesCalculator, scheduleGenerator, timeNeededCalculator, tourneyTypeSelector;

tourneyTypeSelector = require('tourney/selector');

playoffGamesCalculator = require('playoffs/duel');

timeNeededCalculator = require('timing/standard');

scheduleGenerator = require('schedule/generator');

module.exports = function(_arg) {
  var areas, playoffRest, playoffSchedule, playoffTime, rest, schedule, teams, time, timeNeeded, tourneySchedule;
  teams = _arg.teams, time = _arg.time, rest = _arg.rest, areas = _arg.areas, playoffTime = _arg.playoffTime, playoffRest = _arg.playoffRest;
  if (teams < 2) {
    throw new Error("You must have at least two teams to continue");
  }
  tourneySchedule = tourneyTypeSelector(teams, areas);
  playoffSchedule = playoffGamesCalculator(teams);
  timeNeeded = timeNeededCalculator({
    tourneyGames: tourneySchedule.games,
    playoffGames: playoffSchedule.games,
    gameTime: time,
    restTime: rest,
    areas: areas,
    playoffTime: playoffTime,
    playoffRest: playoffRest
  });
  schedule = scheduleGenerator({
    tourneySchedule: tourneySchedule,
    playoffSchedule: playoffSchedule,
    areas: areas
  });
  delete tourneySchedule.schedule;
  delete playoffSchedule.schedule;
  return {
    tourneySchedule: tourneySchedule,
    playoffSchedule: playoffSchedule,
    timeNeededMinutes: timeNeeded,
    schedule: schedule
  };
};
