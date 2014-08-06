_ = require 'underscore'
roundRobin = require '../round-robin'
getTeamNamesAndNumber = require '../team-names-and-number'
generatePods = require './teams-in-pods'
generateDivisions = require './teams-in-divisions'
generateDivisionSchedule = require './division-schedule'
generatePodSchedule = require './pod-schedule'
generateCrossoverSchedule = require './crossover-schedule'

sumGames = (schedule) ->
  _(schedule).reduce(((memo, div) -> memo + div.games), 0)

module.exports = (teams) ->
  {teams, names} = getTeamNamesAndNumber.apply(null, arguments)

  # How should you calculate how many pods you should have?
  teamsInPods = 4
  numOfPods = Math.floor(teams / teamsInPods)

  #returns teams in groups of four on object
  pods = generatePods names, teamsInPods
  divisions = generateDivisions pods

  podSchedule = generatePodSchedule pods
  divisionSchedule = generateDivisionSchedule divisions
  crossoverSchedule = generateCrossoverSchedule divisions

  # console.log crossoverSchedule

  #a bunch of mini round robins to determine divisions
  podGames = sumGames podSchedule

  #round robins amongst the divisions
  divisionGames = sumGames divisionSchedule

  #cross over games (top of lower division plays bottom of division above)
  crossOverGames = crossoverSchedule.length

  console.log podGames, divisionGames, crossOverGames

  {games: podGames + divisionGames + crossOverGames, schedule: [] }


