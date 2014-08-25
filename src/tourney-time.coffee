tourneyTypeSelector = require 'tourney/selector'
playoffGamesCalculator = require 'playoffs/duel'
timeNeededCalculator = require 'timing/standard'
scheduleGenerator = require 'schedule/generator'

module.exports = ({teams, time, rest, areas, playoffTime, playoffRest}) ->
  throw new Error("You must have at least two teams to continue") if teams < 2

  tourneySchedule = tourneyTypeSelector teams, areas
  playoffSchedule = playoffGamesCalculator teams

  timeNeeded = timeNeededCalculator {tourneyGames: tourneySchedule.games, playoffGames: playoffSchedule.games, gameTime: time, restTime: rest, areas, playoffTime, playoffRest}

  schedule = scheduleGenerator {tourneySchedule, playoffSchedule, areas}

  delete tourneySchedule.schedule
  delete playoffSchedule.schedule

  {tourneySchedule, playoffSchedule, timeNeededMinutes: timeNeeded, schedule}

