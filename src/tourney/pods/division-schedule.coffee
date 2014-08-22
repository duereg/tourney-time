_ = require 'underscore'

roundRobin = require '../round-robin'

module.exports = (divisions) ->
  divisionsSchedule = []

  for teamsInDivisions, index in divisions
    divisionSchedule = roundRobin teamsInDivisions
    divisionSchedule.division = index + 1

    _(divisionSchedule.schedule).forEach (game) -> game.id = "Div #{index + 1} Game #{game.id}"

    divisionsSchedule.push divisionSchedule

  divisionsSchedule
