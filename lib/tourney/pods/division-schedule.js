var roundRobin;

roundRobin = require('../round-robin');

module.exports = function(podSchedule) {
  var divisionSchedule, numOfDivisions;
  if (!arguments.length) {
    throw new Error("You must provide an object containing pods to generate the division schedule");
  }
  divisionSchedule = [];
  numOfDivisions = _(podSchedule).max(function(schedule) {
    return schedule.teams.length;
  });
  return divisionSchedule;
};
