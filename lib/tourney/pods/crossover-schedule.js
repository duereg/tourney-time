var calculateNumCrossoverGames, suffix;

suffix = require('util/suffix');

calculateNumCrossoverGames = function(numOfDivisions) {
  return (numOfDivisions - 1) * 2;
};

module.exports = function(divisions) {
  var crossOverGames, crossOverPosition, division, gameOne, gameTwo, i, j, numCrossoverGames, numOfDivisions, ref, ref1, teamsInDivision;
  if (!arguments.length) {
    throw new Error("You must provide divisions to generate the crossover games");
  }
  crossOverGames = [];
  numOfDivisions = divisions.length;
  if (numOfDivisions > 1) {
    numCrossoverGames = calculateNumCrossoverGames(numOfDivisions);
    for (division = i = 0, ref = numCrossoverGames; i < ref; division = i += 1) {
      crossOverGames[division] = {
        teams: []
      };
    }
    for (division = j = 1, ref1 = numOfDivisions; j < ref1; division = j += 1) {
      teamsInDivision = divisions[division - 1].length;
      crossOverPosition = (division - 1) * 2;
      gameOne = crossOverGames[crossOverPosition];
      gameTwo = crossOverGames[crossOverPosition + 1];
      gameOne.id = "Div " + division + "/" + (division + 1) + " <-1->";
      gameTwo.id = "Div " + division + "/" + (division + 1) + " <-2->";
      gameOne.teams.push("" + (teamsInDivision - 1) + (suffix(teamsInDivision - 1)) + " Div " + division);
      gameOne.teams.push("2nd Div " + (division + 1));
      gameTwo.teams.push("" + teamsInDivision + (suffix(teamsInDivision)) + " Div " + division);
      gameTwo.teams.push("1st Div " + (division + 1));
    }
  }
  return crossOverGames;
};
