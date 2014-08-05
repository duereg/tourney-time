var roundRobin;

roundRobin = require('../round-robin');

module.exports = function(divisions) {
  var divisionSchedule, teamsInDivisions, _i, _len;
  divisionSchedule = [];
  for (_i = 0, _len = divisions.length; _i < _len; _i++) {
    teamsInDivisions = divisions[_i];
    divisionSchedule.push(roundRobin(teamsInDivisions));
  }
  return divisionSchedule;
};
