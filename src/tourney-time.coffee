regularGamesCalculator = require 'regular/round-robin'
playoffGamesCalculator = require 'playoffs/knockout'
timeNeededCalculator = require 'timing/standard'

module.exports = ({teams, time, rest, areas}) ->
  throw new Error("You must have at least two teams to continue") if teams < 2

  regularGames = regularGamesCalculator teams
  playoffGames = playoffGamesCalculator teams

  timeNeeded = timeNeededCalculator {regularGames, playoffGames, gameTime: time, restTime: rest, areas}

  {regularGames, playoffGames, timeNeededMinutes: timeNeeded}

