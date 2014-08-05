_ = require 'underscore'

module.exports = (names, numOfPods, leftOverTeams) ->
  teamsInPods = _(names).groupBy (name, index) ->
    if leftOverTeams
      Math.floor(index % (numOfPods + 1)) + 1
    else
      Math.floor(index % numOfPods) + 1

  teamsInPods
