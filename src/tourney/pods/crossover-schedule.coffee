suffix = require 'util/suffix'

calculateNumCrossoverGames = (numOfDivisions) ->
  (numOfDivisions - 1) * 2

module.exports = (divisions) ->
  throw new Error("You must provide divisions to generate the crossover games") unless arguments.length

  crossOverGames = []

  numOfDivisions = divisions.length
  if numOfDivisions > 1
    numCrossoverGames = calculateNumCrossoverGames numOfDivisions

    crossOverGames[division] = [] for division in [0...numCrossoverGames] by 1

    for division in [1...numOfDivisions] by 1
      teamsInDivision = divisions[division - 1].length
      crossOverPosition = (division - 1) * 2

      crossOverGames[crossOverPosition].push "Division #{division} #{teamsInDivision - 1}#{suffix(teamsInDivision - 1)} place"
      crossOverGames[crossOverPosition].push "Division #{division + 1} 2nd place"

      crossOverGames[crossOverPosition + 1].push "Division #{division} #{teamsInDivision}#{suffix(teamsInDivision)} place"
      crossOverGames[crossOverPosition + 1].push "Division #{division + 1} 1st place"

  crossOverGames

