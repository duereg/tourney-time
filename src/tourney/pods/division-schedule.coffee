roundRobin = require '../round-robin'

module.exports = (podSchedule) ->
  divisionSchedule = []

  numOfDivisions = _(podSchedule).max (schedule) -> schedule.teams.length

  # for division in [1..numOfDivisions]


  divisionSchedule
