roundRobin = require '../round-robin'

module.exports = (divisions) ->
  divisionSchedule = []

  for teamsInDivisions in divisions
    divisionSchedule.push roundRobin teamsInDivisions

  divisionSchedule
