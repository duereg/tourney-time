var _;

_ = require('underscore');

module.exports = function(names, teamsInPods) {
  var leftOverTeams, numOfPods, teams, teamsInDivision;
  if (arguments.length !== 2) {
    throw new Error("You must provide the names of the teams and the number of teams per pod");
  }
  teams = names.length;
  numOfPods = teamsInDivision = Math.floor(teams / teamsInPods);
  leftOverTeams = teams % teamsInPods;
  teamsInPods = _(names).groupBy(function(name, index) {
    if (leftOverTeams) {
      return Math.floor(index % (numOfPods + 1)) + 1;
    } else {
      return Math.floor(index % numOfPods) + 1;
    }
  });
  return teamsInPods;
};
