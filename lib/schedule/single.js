module.exports = function(_arg) {
  var balancedSchedule, playoffSchedule, tourneySchedule;
  tourneySchedule = _arg.tourneySchedule, playoffSchedule = _arg.playoffSchedule;
  if (tourneySchedule == null) {
    throw new Error("You must provide a tournament schedule to continue");
  }
  if (playoffSchedule == null) {
    throw new Error("You must provide a playoff schedule to continue");
  }
  balancedSchedule = [];
  if (tourneySchedule.schedule != null) {
    balancedSchedule = tourneySchedule.schedule;
  }
  if (playoffSchedule.schedule != null) {
    balancedSchedule = balancedSchedule.concat(playoffSchedule.schedule);
  }
  return balancedSchedule;
};
