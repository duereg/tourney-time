var _, combineTinyDivisions, generateDivisions, roundRobin, suffix;

_ = require('underscore');

roundRobin = require('../round-robin');

suffix = require('helpers/suffix');

generateDivisions = function(numOfDivisions, numPods, pods) {
  var division, divisions, i, j, k, numTeamsPod, pod, ref, ref1, ref2, teamNum;
  divisions = [];
  for (division = i = 0, ref = numOfDivisions; i < ref; division = i += 1) {
    divisions[division] = [];
  }
  for (pod = j = 1, ref1 = numPods; j <= ref1; pod = j += 1) {
    numTeamsPod = pods[pod].length;
    for (teamNum = k = 1, ref2 = numTeamsPod; k <= ref2; teamNum = k += 1) {
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
