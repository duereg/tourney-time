var generateCrossoverSchedule, generateDivisionSchedule, generateDivisions, generatePodSchedule, generatePods, getTeamNamesAndNumber, roundRobin, spreadSchedule, sumGames, _;

_ = require('underscore');

roundRobin = require('../round-robin');

getTeamNamesAndNumber = require('../team-names-and-number');

generatePods = require('./teams-in-pods');

generateDivisions = require('./teams-in-divisions');

generateDivisionSchedule = require('./division-schedule');

generatePodSchedule = require('./pod-schedule');

generateCrossoverSchedule = require('./crossover-schedule');

sumGames = function(schedule) {
  return _(schedule).reduce((function(memo, div) {
    return memo + div.games;
  }), 0);
};

spreadSchedule = function(schedule) {
  var finalSchedule, round;
  finalSchedule = [];
  round = 0;
  finalSchedule = _(schedule).chain().map(function(section) {
    return section.schedule;
  }).flatten().sortBy(function(game) {
    return game.round;
  }).value();
  return finalSchedule;
};

module.exports = function(teams) {
  var crossOverGames, crossoverSchedule, divisionGames, divisionSchedule, divisions, finalSchedule, names, numOfPods, podGames, podSchedule, pods, spreadDivisionSchedule, spreadPodSchedule, teamsInPods, totalGames, _ref;
  _ref = getTeamNamesAndNumber.apply(null, arguments), teams = _ref.teams, names = _ref.names;
  teamsInPods = 4;
  numOfPods = Math.floor(teams / teamsInPods);
  pods = generatePods(names, teamsInPods);
  divisions = generateDivisions(pods);
  podSchedule = generatePodSchedule(pods);
  divisionSchedule = generateDivisionSchedule(divisions);
  crossoverSchedule = generateCrossoverSchedule(divisions);
  podGames = sumGames(podSchedule);
  divisionGames = sumGames(divisionSchedule);
  crossOverGames = crossoverSchedule.length;
  spreadPodSchedule = spreadSchedule(podSchedule);
  spreadDivisionSchedule = spreadSchedule(divisionSchedule);
  totalGames = podGames + divisionGames + crossOverGames;
  finalSchedule = spreadPodSchedule.concat(spreadDivisionSchedule, crossoverSchedule);
  return {
    games: totalGames,
    schedule: finalSchedule,
    divisions: divisions,
    pods: pods
  };
};
