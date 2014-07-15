module.exports = ({teams, time, rest, areas}) ->
  roundRobinGames = teams + ((teams - 1) * teams) / 2
  playoffGames = teams - (teams % 4)
  totalGames = roundRobinGames + playoffGames

  timeNeeded = (totalGames * (time + rest) ) / areas

  {roundRobinGames, playoffGames, totalGames, timeNeededMinutes: timeNeeded}

