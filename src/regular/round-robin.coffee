robinSchedule = require 'roundrobin'
_ = require 'underscore'

module.exports = (teams) ->
  schedule = _(robinSchedule(teams)).flatten(true)
  games = schedule.length
  {games, schedule}

