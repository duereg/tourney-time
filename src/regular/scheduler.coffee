roundRobin = require './round-robin'
pods = require './pods'

module.exports = (teams) ->
  if teams > 8
    {type: 'pods', games: pods(teams)}
  else
    {type: 'round robin', games: roundRobin(teams)}
