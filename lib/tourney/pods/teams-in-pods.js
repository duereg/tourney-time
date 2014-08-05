var _;

_ = require('underscore');

module.exports = function(names, numOfPods, leftOverTeams) {
  var teamsInPods;
  teamsInPods = _(names).groupBy(function(name, index) {
    if (leftOverTeams) {
      return Math.floor(index % (numOfPods + 1)) + 1;
    } else {
      return Math.floor(index % numOfPods) + 1;
    }
  });
  return teamsInPods;
};
