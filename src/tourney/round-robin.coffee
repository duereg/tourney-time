_ = require 'underscore'
robinSchedule = require 'roundrobin'

getTeamNamesAndNumber = require './team-names-and-number'

module.exports = (teams) ->
  {teams, names} = getTeamNamesAndNumber.apply(null, arguments)

  unflattenedSchedule = robinSchedule(teams, names)

  addedRounds = _(unflattenedSchedule).map (round, roundIndex) ->
    _(round).map (teams, gameIndex) ->
      daRound = roundIndex + 1
      {teams, round: daRound, id: parseInt(daRound.toString() + gameIndex.toString())}

  schedule = _(addedRounds).flatten(true)
  games = schedule.length

  {games, schedule, teams: names}
