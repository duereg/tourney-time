var roundRobin, _;

_ = require('underscore');

roundRobin = require('../round-robin');

module.exports = function(pods) {
  var key, podSchedule, podsSchedule, teamsInPod;
  podsSchedule = [];
  for (key in pods) {
    teamsInPod = pods[key];
    podSchedule = roundRobin(teamsInPod);
    podSchedule.pod = key;
    _(podSchedule.schedule).forEach(function(game) {
      return game.id = "Pod " + key + " Game " + game.id;
    });
    podsSchedule.push(podSchedule);
  }
  return podsSchedule;
};
