var combineTinyDivisions, generateDivisions, roundRobin, suffix, _;

roundRobin = require('../round-robin');

_ = require('underscore');

suffix = require('util/suffix');

generateDivisions = function(numOfDivisions, numPods, pods) {
  var division, divisions, numTeamsPod, pod, teamNum, _i, _j, _k;
  divisions = [];
  for (division = _i = 0; _i < numOfDivisions; division = _i += 1) {
    divisions[division] = [];
  }
  for (pod = _j = 1; _j <= numPods; pod = _j += 1) {
    numTeamsPod = pods[pod].length;
    for (teamNum = _k = 1; _k <= numTeamsPod; teamNum = _k += 1) {
      divisions[teamNum - 1].push("" + teamNum + (suffix(teamNum)) + " Pod " + pod);
    }
  }
  return divisions;
};

combineTinyDivisions = function(divisions) {
  var lastDivision;
  lastDivision = divisions.pop();
  if (lastDivision.length === 1 && divisions.length !== 0) {
    return divisions[divisions.length - 1].push(lastDivision[0]);
  } else {
    return divisions.push(lastDivision);
  }
};

module.exports = function(pods) {
  var divisions, numOfDivisions, numPods, podsArray;
  if (!arguments.length) {
    throw new Error("You must provide pods to generate the divisions");
  }
  divisions = [];
  podsArray = _(pods).values();
  numPods = _(pods).keys().length;
  numOfDivisions = _(podsArray).chain().map(function(pod) {
    return pod.length;
  }).max().value();
  if (!(numOfDivisions === -Infinity || numPods < 2)) {
    divisions = generateDivisions(numOfDivisions, numPods, pods);
    combineTinyDivisions(divisions);
  }
  return divisions;
};
