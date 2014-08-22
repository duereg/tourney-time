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

      gameOne.id = "Div #{division}/#{division + 1} <-1->"
      gameTwo.id = "Div #{division}/#{division + 1} <-2->"

      gameOne.teams.push "#{teamsInDivision - 1}#{suffix(teamsInDivision - 1)} Div #{division}"
      gameOne.teams.push "2nd Div #{division + 1}"

      gameTwo.teams.push "#{teamsInDivision}#{suffix(teamsInDivision)} Div #{division}"
      gameTwo.teams.push "1st Div #{division + 1}"

  crossOverGames

