roundRobin = require './round-robin'
pods = require './pods'

module.exports = (teams, areas) ->
  if teams > 8 and areas <= Math.floor(teams / 4)
    tourney = pods(teams)
    {type: 'pods', games: tourney.games, schedule: tourney.schedule, areas}
  else
    tourney = roundRobin(teams)
    areaLimit = Math.floor(teams / 2)
    areas = areaLimit if areas > areaLimit
    {type: 'round robin', games: tourney.games, schedule: tourney.schedule, areas}
