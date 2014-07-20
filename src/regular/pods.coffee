roundRobin = require './round-robin'

calculateDivisionGames = (teamsInDivision, numOfDivisions, leftOverTeams) ->
  divisionGames = 0

  for i in [0...numOfDivisions] by 1
    if i < leftOverTeams
      divisionGames += roundRobin(teamsInDivision + 1).games
    else
      divisionGames += roundRobin(teamsInDivision).games

  divisionGames

calculateCrossoverGames = (numOfPods, teamsInPods) ->
  crossOverGames = 0

  if numOfPods > 1
    crossOverGames = (teamsInPods - 1) * 2

  crossOverGames


module.exports = (teams) ->
  # How should you calculate how many pods you should have?
  teamsInPods = numOfDivisions = 4
  numOfPods = teamsInDivision = Math.floor(teams / teamsInPods)
  leftOverTeams = teams % teamsInPods

  #a bunch of mini round robins to determine divisions
  podGames = roundRobin(teamsInPods).games * numOfPods + roundRobin(leftOverTeams).games

  #round robins amongst the divisions
  divisionGames = calculateDivisionGames teamsInDivision, numOfDivisions, leftOverTeams

  #cross over games (top of lower division plays bottom of division above)
  crossOverGames = calculateCrossoverGames numOfPods, teamsInPods

  podGames + divisionGames + crossOverGames


