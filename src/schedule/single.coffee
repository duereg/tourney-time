# type, games, schedule
module.exports = ({tourneySchedule}) ->
  balancedSchedule = []

  if tourneySchedule?.schedule?
    balancedSchedule = tourneySchedule.schedule

  balancedSchedule
