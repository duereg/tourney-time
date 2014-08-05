roundRobin = require '../round-robin'

module.exports = (pods) ->
  podSchedule = []

  for key, teamsInPod of pods
    podSchedule.push roundRobin teamsInPod

  podSchedule
