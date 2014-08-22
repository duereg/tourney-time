var calculateNumCrossoverGames, suffix;

suffix = require('util/suffix');

calculateNumCrossoverGames = function(numOfDivisions) {
  return (numOfDivisions - 1) * 2;
};

module.exports = function(divisions) {
  var crossOverGames, crossOverPosition, division, gameOne, gameTwo, numCrossoverGames, numOfDivisions, teamsInDivision, _i, _j;
  if (!arguments.length) {
    throw new Error("You must provide divisions to generate the crossover games");
  }
  crossOverGames = [];
  numOfDivisions = divisions.length;
  if (numOfDivisions > 1) {
    numCrossoverGames = calculateNumCrossoverGames(numOfDivisions);
    for (division = _i = 0; _i < numCrossoverGames; division = _i += 1) {
      crossOverGames[division] = {
        teams: []
      };
    }
    for (division = _j = 1; _j < numOfDivisions; division = _j += 1) {
      teamsInDivision = divisions[division - 1].length;
      crossOverPosition = (division - 1) * 2;
      gameOne = crossOverGames[crossOverPosition];
      gameTwo = crossOverGames[crossOverPosition + 1];
      gameOne.id = "Division " + division + "/" + (division + 1) + " crossover 1";
      gameTwo.id = "Division " + division + "/" + (division + 1) + " crossover 2";
      gameOne.teams.push("Division " + division + " " + (teamsInDivision - 1) + (suffix(teamsInDivision - 1)) + " place");
      gameOne.teams.push("Division " + (division + 1) + " 2nd place");
      gameTwo.teams.push("Division " + division + " " + teamsInDivision + (suffix(teamsInDivision)) + " place");
      gameTwo.teams.push("Division " + (division + 1) + " 1st place");
    }
  }
  return crossOverGames;
};
