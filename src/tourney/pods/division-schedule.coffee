roundRobin = require '../round-robin'

module.exports = (podSchedule) ->
  throw new Error("You must provide an object containing pods to generate the division schedule") unless arguments.length

  divisionSchedule = []

  numOfDivisions = _(podSchedule).max (schedule) -> schedule.teams.length

  # for division in [1..numOfDivisions]


  divisionSchedule
