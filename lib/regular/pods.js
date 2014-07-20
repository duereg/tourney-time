var calculateCrossoverGames, calculateDivisionGames, roundRobin;

roundRobin = require('./round-robin');

calculateDivisionGames = function(teamsInDivision, numOfDivisions, leftOverTeams) {
  var divisionGames, i, _i;
  divisionGames = 0;
  for (i = _i = 0; _i < numOfDivisions; i = _i += 1) {
    if (i < leftOverTeams) {
      divisionGames += roundRobin(teamsInDivision + 1);
    } else {
      divisionGames += roundRobin(teamsInDivision);
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
  var crossOverGames, divisionGames, leftOverTeams, numOfDivisions, numOfPods, podGames, teamsInDivision, teamsInPods;
  teamsInPods = numOfDivisions = 4;
  numOfPods = teamsInDivision = Math.floor(teams / teamsInPods);
  leftOverTeams = teams % teamsInPods;
  podGames = roundRobin(teamsInPods) * numOfPods + roundRobin(leftOverTeams);
  divisionGames = calculateDivisionGames(teamsInDivision, numOfDivisions, leftOverTeams);
  crossOverGames = calculateCrossoverGames(numOfPods, teamsInPods);
  return podGames + divisionGames + crossOverGames;
};
