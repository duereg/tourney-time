module.exports = ({teams, time, rest, areas}) ->
  games = teams - (teams % 4)

  timeNeeded = (games * (time + rest) ) / areas

  {games, timeNeeded}
