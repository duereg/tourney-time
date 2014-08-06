var combineTinyDivisions, generateDivisions, roundRobin, suffix, _;

roundRobin = require('../round-robin');

_ = require('underscore');

suffix = require('util/suffix');

generateDivisions = function(numOfDivisions, numPods, pods) {
  var division, divisions, numTeamsPod, pod, teamNum, _i, _j, _k;
  divisions = [];
  for (division = _i = 0; 0 <= numOfDivisions ? _i < numOfDivisions : _i > numOfDivisions; division = 0 <= numOfDivisions ? ++_i : --_i) {
    divisions[division] = [];
  }
  for (pod = _j = 1; 1 <= numPods ? _j <= numPods : _j >= numPods; pod = 1 <= numPods ? ++_j : --_j) {
    numTeamsPod = pods[pod].length;
    for (teamNum = _k = 1; 1 <= numTeamsPod ? _k <= numTeamsPod : _k >= numTeamsPod; teamNum = 1 <= numTeamsPod ? ++_k : --_k) {
      divisions[teamNum - 1].push("" + teamNum + (suffix(teamNum)) + " Pod " + pod);
    }
  }
  return divisions;
};

combineTinyDivisions = function(divisions) {
  var lastDivision, _ref;
  lastDivision = divisions.pop();
  if ((lastDivision != null ? lastDivision.length : void 0) === 1) {
    return (_ref = divisions[divisions.length - 1]) != null ? _ref.push(lastDivision[0]) : void 0;
  } else {
    return divisions.push(lastDivision);
  }
};

module.exports = function(pods) {
  var divisions, numOfDivisions, numPods, podsArray, _ref;
  if (!arguments.length) {
    throw new Error("You must provide pods to generate the divisions");
  }
  divisions = [];
  podsArray = _(pods).values();
  numPods = (_ref = _(pods).keys()) != null ? _ref.length : void 0;
  numOfDivisions = _(podsArray).chain().map(function(pod) {
    return pod != null ? pod.length : void 0;
  }).max().value();
  if (!(numOfDivisions === -Infinity || numPods < 2)) {
    divisions = generateDivisions(numOfDivisions, numPods, pods);
    combineTinyDivisions(divisions);
  }
  return divisions;
};
