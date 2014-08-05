var roundRobin, suffix, _;

roundRobin = require('../round-robin');

_ = require('underscore');

suffix = function(n) {
  var d;
  d = (n | 0) % 100;
  if (d > 3 && d < 21) {
    return 'th';
  } else {
    return ['th', 'st', 'nd', 'rd'][d % 10] || 'th';
  }
};

module.exports = function(pods) {
  var division, divisions, lastDivision, numOfDivisions, numPods, numTeamsPod, pod, podsArray, teamNum, _i, _j, _k, _ref, _ref1;
  if (!arguments.length) {
    throw new Error("You must provide pods to generate the divisions");
  }
  divisions = [];
  podsArray = _(pods).values();
  numPods = (_ref = _(pods).keys()) != null ? _ref.length : void 0;
  numOfDivisions = _(podsArray).chain().map(function(pod) {
    return pod != null ? pod.length : void 0;
  }).max().value();
  if (numOfDivisions === -Infinity) {
    return divisions;
  }
  for (division = _i = 0; 0 <= numOfDivisions ? _i < numOfDivisions : _i > numOfDivisions; division = 0 <= numOfDivisions ? ++_i : --_i) {
    divisions[division] = [];
  }
  for (pod = _j = 1; 1 <= numPods ? _j <= numPods : _j >= numPods; pod = 1 <= numPods ? ++_j : --_j) {
    numTeamsPod = pods[pod].length;
    for (teamNum = _k = 1; 1 <= numTeamsPod ? _k <= numTeamsPod : _k >= numTeamsPod; teamNum = 1 <= numTeamsPod ? ++_k : --_k) {
      divisions[teamNum - 1].push("Pod " + pod + " " + teamNum + (suffix(teamNum)) + " place");
    }
  }
  lastDivision = divisions.pop();
  if ((lastDivision != null ? lastDivision.length : void 0) === 1) {
    if ((_ref1 = divisions[divisions.length - 1]) != null) {
      _ref1.push(lastDivision[0]);
    }
  } else {
    divisions.push(lastDivision);
  }
  return divisions;
};
