var calculateCrossoverGames, calculateDivisionGames, getTeamNamesAndNumber, roundRobin;

roundRobin = require('./round-robin');

getTeamNamesAndNumber = require('./team-names-and-number');

calculateDivisionGames = function(teamsInDivision, numOfDivisions, leftOverTeams) {
  var divisionGames, i, _i;
  divisionGames = 0;
  for (i = _i = 0; _i < numOfDivisions; i = _i += 1) {
    if (i < leftOverTeams) {
      divisionGames += roundRobin(teamsInDivision + 1).games;
    } else {
      divisionGames += roundRobin(teamsInDivision).games;
    }
  }
  return divisionGames;
};

calculateCrossoverGames = function(numOfPods, teamsInPods) {
  var crossOverGames;
  crossOverGames = 0;
  if (numOfPods > 1) {
    crossOverGames = (teamsInPods - 1) * 2;
  }
  return crossOverGames;
};

module.exports = function(teams) {
  var crossOverGames, divisionGames, leftOverTeams, names, numOfDivisions, numOfPods, podGames, teamsInDivision, teamsInPods, _ref;
  _ref = getTeamNamesAndNumber.apply(null, arguments), teams = _ref.teams, names = _ref.names;
  teamsInPods = numOfDivisions = 4;
  numOfPods = teamsInDivision = Math.floor(teams / teamsInPods);
  leftOverTeams = teams % teamsInPods;
  podGames = roundRobin(teamsInPods).games * numOfPods + roundRobin(leftOverTeams).games;
  divisionGames = calculateDivisionGames(teamsInDivision, numOfDivisions, leftOverTeams);
  crossOverGames = calculateCrossoverGames(numOfPods, teamsInPods);
  return {
    games: podGames + divisionGames + crossOverGames,
    schedule: []
  };
};
