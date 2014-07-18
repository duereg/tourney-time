module.exports = (teams) ->
  teams - (teams % 4)
