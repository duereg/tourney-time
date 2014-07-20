roundRobin = require './round-robin'
pods = require './pods'

module.exports = (teams) ->
  if teams > 8
    {type: 'pods', games: pods(teams)}
  else
    tourney = roundRobin(teams)
    {type: 'round robin', games: tourney.games}
