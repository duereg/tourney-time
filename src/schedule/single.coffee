# type, games, schedule
module.exports = ({tourneySchedule, playoffSchedule}) ->
  throw new Error("You must provide a tournament schedule to continue") unless tourneySchedule?
  throw new Error("You must provide a playoff schedule to continue") unless playoffSchedule?

  balancedSchedule = []

  if tourneySchedule.schedule?
    balancedSchedule = tourneySchedule.schedule

  if playoffSchedule.schedule?
    balancedSchedule = balancedSchedule.concat(playoffSchedule.schedule)

  balancedSchedule
