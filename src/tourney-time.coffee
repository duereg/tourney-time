tourneyTypeSelector = require 'tourney/selector'
playoffGamesCalculator = require 'playoffs/knockout'
timeNeededCalculator = require 'timing/standard'
scheduleGenerator = require 'schedule/generator'

module.exports = ({teams, time, rest, areas}) ->
  throw new Error("You must have at least two teams to continue") if teams < 2

  tourneySchedule = tourneyTypeSelector teams
  playoffGames = playoffGamesCalculator teams

  timeNeeded = timeNeededCalculator {tourneyGames: tourneySchedule.games, playoffGames, gameTime: time, restTime: rest, areas}

  schedule = scheduleGenerator {tourneySchedule, playoffGames, areas}

  delete tourneySchedule.schedule

  {tourneySchedule, playoffGames, timeNeededMinutes: timeNeeded, schedule}

