_ = require 'underscore'

scheduleBalancer = (thingToSchedule, areas) ->
  balancedSchedule = []

  currentRound = 1

  for game in thingToSchedule.schedule
    if balancedSchedule.length
      round = balancedSchedule[balancedSchedule.length - 1]

      if round.length < areas
        hasTeam = _(round)
          .chain()
          .map((aRound) -> aRound.teams)
          .flatten()
          .intersection(game.teams)
          .value()
          .length

        if hasTeam or currentRound isnt game.round
          balancedSchedule.push [game]
        else
          round.push game
      else
        balancedSchedule.push [game]

    else
      balancedSchedule.push [game]

    currentRound = game.round

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
