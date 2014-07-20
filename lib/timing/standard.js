module.exports = function(_arg) {
  var areas, calcAreaLength, gameTime, playoffAreaLength, playoffGames, regularAreaLength, regularGames, restTime;
  regularGames = _arg.regularGames, playoffGames = _arg.playoffGames, gameTime = _arg.gameTime, restTime = _arg.restTime, areas = _arg.areas;
  calcAreaLength = function(games) {
    return Math.floor(games / areas) + games % areas;
  };
  regularAreaLength = calcAreaLength(regularGames);
  playoffAreaLength = calcAreaLength(playoffGames);
  return (regularAreaLength + playoffAreaLength) * (gameTime + restTime);
};