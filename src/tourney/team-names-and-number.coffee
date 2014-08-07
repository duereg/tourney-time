module.exports = (teams) ->
  throw new Error("You must provide either the number of teams or a list of team names") if arguments.length is 0

  names = []

  if teams?.length
    names = teams
    teams = teams.length
  else if teams
    for name in [1..teams] by 1
      names.push(name)

  teams ?= 0

  { names, teams }
