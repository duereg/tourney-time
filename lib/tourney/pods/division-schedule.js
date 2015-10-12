var _, roundRobin;

_ = require('underscore');

roundRobin = require('../round-robin');

module.exports = function(divisions) {
  var divisionSchedule, divisionsSchedule, i, index, len, teamsInDivisions;
  divisionsSchedule = [];
  for (index = i = 0, len = divisions.length; i < len; index = ++i) {
    teamsInDivisions = divisions[index];
    divisionSchedule = roundRobin(teamsInDivisions);
    divisionSchedule.division = index + 1;
    _(divisionSchedule.schedule).forEach(function(game) {
      return game.id = "Div " + (index + 1) + " Game " + game.id;
    });
    divisionsSchedule.push(divisionSchedule);
  }
  return divisionsSchedule;
};
