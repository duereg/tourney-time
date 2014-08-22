_ = require 'underscore'

scheduleBalancer = (thingToSchedule, areas) ->
  balancedSchedule = []

  for game in thingToSchedule.schedule
    if balancedSchedule.length
      round = balancedSchedule[balancedSchedule.length - 1]

      if round.length < areas
        hasTeam = _(round).chain().flatten().intersection(game).value().length

        if hasTeam
          balancedSchedule.push [game]
        else
          round.push game
      else
        balancedSchedule.push [game]

    else
      balancedSchedule.push [game]

  balancedSchedule

module.exports = ({tourneySchedule, playoffSchedule, areas}) ->
  throw new Error("You must provide a tournament schedule to continue") unless tourneySchedule?
  throw new Error("You must provide a playoff schedule to continue") unless playoffSchedule?

  balancedSchedule = []

  if tourneySchedule.schedule?
    balancedSchedule = scheduleBalancer tourneySchedule, areas

  if playoffSchedule.schedule?
    balancedSchedule = balancedSchedule.concat scheduleBalancer(playoffSchedule, areas)

  balancedSchedule
