getTeamNamesAndNumber = require './team-names-and-number'

robinSchedule = require 'roundrobin'
_ = require 'underscore'

module.exports = (teams) ->
  {teams, names} = getTeamNamesAndNumber.apply(null, arguments)

  schedule = _(robinSchedule(teams, names)).flatten(true)
  games = schedule.length

  {games, schedule}

