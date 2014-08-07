roundRobin = require '../round-robin'
_ = require 'underscore'
suffix = require 'util/suffix'

generateDivisions = (numOfDivisions, numPods, pods) ->
  divisions = []

  divisions[division] = [] for division in [0...numOfDivisions] by 1

  for pod in [1..numPods] by 1
    numTeamsPod = pods[pod].length

    for teamNum in [1..numTeamsPod] by 1
      divisions[teamNum - 1].push "#{teamNum}#{suffix teamNum} Pod #{pod}"

  divisions

combineTinyDivisions = (divisions) ->
  lastDivision = divisions.pop()

  if lastDivision.length is 1 and divisions.length isnt 0
    divisions[divisions.length - 1].push lastDivision[0]
  else
    divisions.push lastDivision

module.exports = (pods) ->
  throw new Error("You must provide pods to generate the divisions") unless arguments.length

  divisions = []

  podsArray = _(pods).values()
  numPods = _(pods).keys().length

  numOfDivisions = _(podsArray).chain().map( (pod) -> pod.length).max().value()

  unless numOfDivisions is -Infinity or numPods < 2
    divisions = generateDivisions numOfDivisions, numPods, pods
    combineTinyDivisions divisions

  divisions
