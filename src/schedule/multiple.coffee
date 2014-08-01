_ = require 'underscore'

module.exports = ({tourneySchedule, playoffSchedule, areas}) ->
  balancedSchedule = []

  if tourneySchedule?.schedule?
    for game in tourneySchedule.schedule
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
