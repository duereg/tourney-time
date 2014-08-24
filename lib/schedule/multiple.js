var scheduleBalancer, _;

_ = require('underscore');

scheduleBalancer = function(thingToSchedule, areas) {
  var balancedSchedule, currentRound, game, hasTeam, round, _i, _len, _ref;
  balancedSchedule = [];
  currentRound = 1;
  _ref = thingToSchedule.schedule;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    game = _ref[_i];
    if (balancedSchedule.length) {
      round = balancedSchedule[balancedSchedule.length - 1];
      if (round.length < areas) {
        hasTeam = _(round).chain().map(function(round) {
          return round.teams;
        }).flatten().intersection(game.teams).value().length;
        if (hasTeam || currentRound !== game.round) {
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
    currentRound = game.round;
  }
  return balancedSchedule;
};

module.exports = function(_arg) {
  var areas, balancedSchedule, playoffSchedule, tourneySchedule;
  tourneySchedule = _arg.tourneySchedule, playoffSchedule = _arg.playoffSchedule, areas = _arg.areas;
  if (tourneySchedule == null) {
    throw new Error("You must provide a tournament schedule to continue");
  }
  if (playoffSchedule == null) {
    throw new Error("You must provide a playoff schedule to continue");
  }
  balancedSchedule = [];
  if (tourneySchedule.schedule != null) {
    balancedSchedule = scheduleBalancer(tourneySchedule, areas);
  }
  if (playoffSchedule.schedule != null) {
    balancedSchedule = balancedSchedule.concat(scheduleBalancer(playoffSchedule, areas));
  }
  return balancedSchedule;
};
