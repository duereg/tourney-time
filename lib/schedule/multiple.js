var _;

_ = require('underscore');

module.exports = function(_arg) {
  var areas, balancedSchedule, game, hasTeam, playoffSchedule, round, tourneySchedule, _i, _len, _ref;
  tourneySchedule = _arg.tourneySchedule, playoffSchedule = _arg.playoffSchedule, areas = _arg.areas;
  balancedSchedule = [];
  if ((tourneySchedule != null ? tourneySchedule.schedule : void 0) != null) {
    _ref = tourneySchedule.schedule;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      game = _ref[_i];
      if (balancedSchedule.length) {
        round = balancedSchedule[balancedSchedule.length - 1];
        if (round.length < areas) {
          hasTeam = _(round).chain().flatten().intersection(game).value().length;
          if (hasTeam) {
            balancedSchedule.push([game]);
          } else {
            round.push(game);
          }
        } else {
          balancedSchedule.push([game]);
        }
      } else {
        balancedSchedule.push([game]);
      }
    }
  }
  return balancedSchedule;
};
