var roundRobin;

roundRobin = require('../round-robin');

module.exports = function(podSchedule) {
  var divisionSchedule, numOfDivisions;
  divisionSchedule = [];
  numOfDivisions = _(podSchedule).max(function(schedule) {
    return schedule.teams.length;
  });
  return divisionSchedule;
};
