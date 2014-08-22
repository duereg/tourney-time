_ = require 'underscore'

roundRobin = require '../round-robin'

module.exports = (pods) ->
  podsSchedule = []

  for key, teamsInPod of pods
    podSchedule = roundRobin teamsInPod
    podSchedule.pod = key

    _(podSchedule.schedule).forEach (game) -> game.id = "Pod #{key} Game #{game.id}"

    podsSchedule.push podSchedule

  podsSchedule
