roundRobin = require '../round-robin'
_ = require 'underscore'

suffix = (n) ->
  d = (n|0) % 100
  if d > 3 and d < 21 then 'th' else ['th', 'st', 'nd', 'rd'][d%10] or 'th'

module.exports = (pods) ->
  throw new Error("You must provide pods to generate the divisions") unless arguments.length

  divisionSchedule = []

  podsArray = _(pods).values()
  numPods = _(pods).keys()?.length

  numOfDivisions = _(podsArray).chain().map( (pod) -> pod?.length).max().value()

  if numOfDivisions is -Infinity
    return divisionSchedule

  divisionSchedule[division] = [] for division in [0...numOfDivisions]

  for pod in [1..numPods]
    numTeamsPod = pods[pod].length

    for teamNum in [1..numTeamsPod]
      divisionSchedule[teamNum - 1].push "Pod #{pod} #{teamNum}#{suffix teamNum} place"

  lastDivision = divisionSchedule.pop()

  if lastDivision?.length is 1
    divisionSchedule[divisionSchedule.length - 1]?.push lastDivision[0]
  else
    divisionSchedule.push lastDivision

  divisionSchedule
