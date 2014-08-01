module.exports = function(_arg) {
  var areas, calcAreaLength, gameTime, playoffAreaLength, playoffGames, restTime, tourneyAreaLength, tourneyGames;
  tourneyGames = _arg.tourneyGames, playoffGames = _arg.playoffGames, gameTime = _arg.gameTime, restTime = _arg.restTime, areas = _arg.areas;
  calcAreaLength = function(games) {
    return Math.floor(games / areas) + games % areas;
  };
  tourneyAreaLength = calcAreaLength(tourneyGames);
  playoffAreaLength = calcAreaLength(playoffGames);
  return (tourneyAreaLength + playoffAreaLength) * (gameTime + restTime);
};
