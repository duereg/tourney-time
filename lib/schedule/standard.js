module.exports = function(_arg) {
  var areas, balancedSchedule, game, playoffGames, tourneySchedule, _i, _len, _ref;
  tourneySchedule = _arg.tourneySchedule, playoffGames = _arg.playoffGames, areas = _arg.areas;
  balancedSchedule = [];
  if ((tourneySchedule != null ? tourneySchedule.schedule : void 0) != null) {
    _ref = tourneySchedule.schedule;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      game = _ref[_i];
      console.log(game);
      if (balancedSchedule.length) {

      } else {
        balancedSchedule.push([game]);
      }
    }
  }
  return balancedSchedule;
};
