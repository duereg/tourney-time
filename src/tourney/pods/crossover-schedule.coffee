suffix = require 'util/suffix'

calculateNumCrossoverGames = (numOfDivisions) ->
  (numOfDivisions - 1) * 2

module.exports = (divisions) ->
  throw new Error("You must provide divisions to generate the crossover games") unless arguments.length

  crossOverGames = []

  numOfDivisions = divisions.length
  if numOfDivisions > 1
    numCrossoverGames = calculateNumCrossoverGames numOfDivisions

    crossOverGames[division] = {teams: []} for division in [0...numCrossoverGames] by 1

    for division in [1...numOfDivisions] by 1
      teamsInDivision = divisions[division - 1].length
      crossOverPosition = (division - 1) * 2

      gameOne = crossOverGames[crossOverPosition]
      gameTwo = crossOverGames[crossOverPosition + 1]

      gameOne.id = "Division #{division}/#{division + 1} crossover 1"
      gameTwo.id = "Division #{division}/#{division + 1} crossover 2"

      gameOne.teams.push "Division #{division} #{teamsInDivision - 1}#{suffix(teamsInDivision - 1)} place"
      gameOne.teams.push "Division #{division + 1} 2nd place"

      gameTwo.teams.push "Division #{division} #{teamsInDivision}#{suffix(teamsInDivision)} place"
      gameTwo.teams.push "Division #{division + 1} 1st place"

  crossOverGames

