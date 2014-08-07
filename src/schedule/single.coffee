# type, games, schedule
module.exports = ({tourneySchedule}) ->
  throw new Error("You provide a tournament schedule to continue") unless tourneySchedule?

  balancedSchedule = []

  if tourneySchedule.schedule?
    balancedSchedule = tourneySchedule.schedule

  balancedSchedule
