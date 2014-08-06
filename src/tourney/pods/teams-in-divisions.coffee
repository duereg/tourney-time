roundRobin = require '../round-robin'
_ = require 'underscore'
suffix = require 'util/suffix'

generateDivisions = (numOfDivisions, numPods, pods) ->
  divisions = []

  divisions[division] = [] for division in [0...numOfDivisions]

  for pod in [1..numPods]
    numTeamsPod = pods[pod].length

    for teamNum in [1..numTeamsPod]
      divisions[teamNum - 1].push "Pod #{pod} #{teamNum}#{suffix teamNum} place"

  divisions

combineTinyDivisions = (divisions) ->
  lastDivision = divisions.pop()

  if lastDivision?.length is 1
    divisions[divisions.length - 1]?.push lastDivision[0]
  else
    divisions.push lastDivision

module.exports = (pods) ->
  throw new Error("You must provide pods to generate the divisions") unless arguments.length

  divisions = []

  podsArray = _(pods).values()
  numPods = _(pods).keys()?.length

  numOfDivisions = _(podsArray).chain().map( (pod) -> pod?.length).max().value()

  unless numOfDivisions is -Infinity or numPods < 3
    divisions = generateDivisions numOfDivisions, numPods, pods
    combineTinyDivisions divisions

  divisions
