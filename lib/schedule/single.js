module.exports = function(_arg) {
  var balancedSchedule, tourneySchedule;
  tourneySchedule = _arg.tourneySchedule;
  balancedSchedule = [];
  if ((tourneySchedule != null ? tourneySchedule.schedule : void 0) != null) {
    balancedSchedule = tourneySchedule.schedule;
  }
  return balancedSchedule;
};
