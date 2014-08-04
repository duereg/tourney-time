module.exports = (teams) ->
  throw new Error("You must provide either the number of teams or a list of team names") if arguments.length is 0

  names = null

  if teams?.length
    names = teams
    teams = teams.length

  { names, teams }
