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

spreadSchedule = (schedule) ->
  finalSchedule = []
  game = 0
  found = true

  while found
    games = _(schedule).chain().map((section) -> section.schedule[game]).compact().value()
    found = games.length
    finalSchedule = finalSchedule.concat games
    game++

  finalSchedule

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

  podGames = sumGames podSchedule #a bunch of mini round robins to determine divisions
  divisionGames = sumGames divisionSchedule #round robins amongst the divisions
  crossOverGames = crossoverSchedule.length #cross over games (top of lower division plays bottom of division above)

  spreadPodSchedule = spreadSchedule podSchedule
  spreadDivisionSchedule = spreadSchedule divisionSchedule

  totalGames = podGames + divisionGames + crossOverGames

  finalSchedule = spreadPodSchedule.concat(spreadDivisionSchedule, crossoverSchedule)

  {games: totalGames, schedule: finalSchedule, divisions, pods }


