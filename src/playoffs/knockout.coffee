module.exports = (teams) ->
  if teams < 2
    0
  else if teams < 4
    1
  else
    teams - (teams % 4)
