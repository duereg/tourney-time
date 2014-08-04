roundRobin = require './round-robin'
pods = require './pods'

module.exports = (teams) ->
  if teams > 8
    tourney = pods(teams)
    {type: 'pods', games: tourney.games, schedule: tourney.schedule}
  else
    tourney = roundRobin(teams)
    {type: 'round robin', games: tourney.games, schedule: tourney.schedule}
