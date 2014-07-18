module.exports = ({regularGames, playoffGames, gameTime, restTime, areas}) ->

  calcAreaLength = (games) ->
    Math.floor(games / areas) + games % areas

  regularAreaLength = calcAreaLength(regularGames)
  playoffAreaLength = calcAreaLength(playoffGames)

  (regularAreaLength + playoffAreaLength) * (gameTime + restTime)
