module.exports = ({teams, time, rest, areas}) ->
  games = teams + ((teams - 1) * teams) / 2
  timeNeeded = (games * (time + rest) ) / areas

  {games, timeNeeded}
