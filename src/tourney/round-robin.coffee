_ = require 'underscore'
robinSchedule = require 'roundrobin'

getTeamNamesAndNumber = require './team-names-and-number'

module.exports = (teams) ->
  {teams, names} = getTeamNamesAndNumber.apply(null, arguments)

  schedule = _(robinSchedule(teams, names)).flatten(true)
  games = schedule.length

  schedule = _(schedule).map (teams, index) -> { id: index + 1, teams}

  {games, schedule, teams: names}
