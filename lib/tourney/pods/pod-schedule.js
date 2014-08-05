var roundRobin;

roundRobin = require('../round-robin');

module.exports = function(pods) {
  var key, podSchedule, teamsInPod;
  podSchedule = [];
  for (key in pods) {
    teamsInPod = pods[key];
    podSchedule.push(roundRobin(teamsInPod));
  }
  return podSchedule;
};
