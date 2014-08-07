module.exports = function(_arg) {
  var balancedSchedule, tourneySchedule;
  tourneySchedule = _arg.tourneySchedule;
  if (tourneySchedule == null) {
    throw new Error("You provide a tournament schedule to continue");
  }
  balancedSchedule = [];
  if (tourneySchedule.schedule != null) {
    balancedSchedule = tourneySchedule.schedule;
  }
  return balancedSchedule;
};
