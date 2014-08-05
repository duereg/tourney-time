_ = require 'underscore'

module.exports = (names, teamsInPods) ->
  throw new Error("You must provide the names of the teams and the number of teams per pod") if arguments.length isnt 2

  teams = names.length
  numOfPods = teamsInDivision = Math.floor(teams / teamsInPods)
  leftOverTeams = teams % teamsInPods

  teamsInPods = _(names).groupBy (name, index) ->
    if leftOverTeams
      Math.floor(index % (numOfPods + 1)) + 1
    else
      Math.floor(index % numOfPods) + 1

  teamsInPods
