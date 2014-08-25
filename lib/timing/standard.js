module.exports = function(_arg) {
  var areas, calcAreaLength, gameTime, playoffAreaLength, playoffGames, playoffRest, playoffTime, restTime, tourneyAreaLength, tourneyGames;
  tourneyGames = _arg.tourneyGames, playoffGames = _arg.playoffGames, gameTime = _arg.gameTime, restTime = _arg.restTime, areas = _arg.areas, playoffTime = _arg.playoffTime, playoffRest = _arg.playoffRest;
  calcAreaLength = function(games) {
    return Math.floor(games / areas) + games % areas;
  };
  tourneyAreaLength = calcAreaLength(tourneyGames);
  playoffAreaLength = calcAreaLength(playoffGames);
  return tourneyAreaLength * (gameTime + restTime) + playoffAreaLength * (playoffTime + playoffRest);
};
