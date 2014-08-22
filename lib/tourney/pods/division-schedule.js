var roundRobin, _;

_ = require('underscore');

roundRobin = require('../round-robin');

module.exports = function(divisions) {
  var divisionSchedule, divisionsSchedule, index, teamsInDivisions, _i, _len;
  divisionsSchedule = [];
  for (index = _i = 0, _len = divisions.length; _i < _len; index = ++_i) {
    teamsInDivisions = divisions[index];
    divisionSchedule = roundRobin(teamsInDivisions);
    divisionSchedule.division = index + 1;
    _(divisionSchedule.schedule).forEach(function(game) {
      return game.id = "Division " + (index + 1) + " Game " + game.id;
    });
    divisionsSchedule.push(divisionSchedule);
  }
  return divisionsSchedule;
};
