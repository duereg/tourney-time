module.exports = ({tourneyGames, playoffGames, gameTime, restTime, areas}) ->

  calcAreaLength = (games) ->
    Math.floor(games / areas) + games % areas

  tourneyAreaLength = calcAreaLength(tourneyGames)
  playoffAreaLength = calcAreaLength(playoffGames)

  (tourneyAreaLength + playoffAreaLength) * (gameTime + restTime)
