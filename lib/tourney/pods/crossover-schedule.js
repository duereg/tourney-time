var calculateNumCrossoverGames, suffix;

suffix = require('util/suffix');

calculateNumCrossoverGames = function(numOfDivisions) {
  if (numOfDivisions > 1) {
    return (numOfDivisions - 1) * 2;
  } else {
    return 0;
  }
};

module.exports = function(divisions) {
  var crossOverGames, crossOverPosition, division, numCrossoverGames, numOfDivisions, teamsInDivision, _i, _j;
  if (!arguments.length) {
    throw new Error("You must provide divisions to generate the crossover games");
  }
  crossOverGames = [];
  numOfDivisions = divisions.length;
  if (numOfDivisions > 1) {
    numCrossoverGames = calculateNumCrossoverGames(numOfDivisions);
    for (division = _i = 0; 0 <= numCrossoverGames ? _i < numCrossoverGames : _i > numCrossoverGames; division = 0 <= numCrossoverGames ? ++_i : --_i) {
      crossOverGames[division] = [];
    }
    for (division = _j = 1; 1 <= numOfDivisions ? _j < numOfDivisions : _j > numOfDivisions; division = 1 <= numOfDivisions ? ++_j : --_j) {
      teamsInDivision = divisions[division - 1].length;
      crossOverPosition = (division - 1) * 2;
      crossOverGames[crossOverPosition].push("Division " + division + " " + (teamsInDivision - 1) + (suffix(teamsInDivision - 1)) + " place");
      crossOverGames[crossOverPosition].push("Division " + (division + 1) + " 2nd place");
      crossOverGames[crossOverPosition + 1].push("Division " + division + " " + teamsInDivision + (suffix(teamsInDivision)) + " place");
      crossOverGames[crossOverPosition + 1].push("Division " + (division + 1) + " 1st place");
    }
  }
  return crossOverGames;
};
