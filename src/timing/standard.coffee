module.exports = ({tourneyGames, playoffGames, gameTime, restTime, areas, playoffTime, playoffRest}) ->

  calcAreaLength = (games) ->
    Math.floor(games / areas) + games % areas

  tourneyAreaLength = calcAreaLength(tourneyGames)
  playoffAreaLength = calcAreaLength(playoffGames)

  (tourneyAreaLength) * (gameTime + restTime) + playoffAreaLength * (playoffTime + playoffRest)
