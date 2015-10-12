module.exports = function(arg) {
  var areas, calcAreaLength, gameTime, playoffAreaLength, playoffGames, playoffRest, playoffTime, restTime, tourneyAreaLength, tourneyGames;
  tourneyGames = arg.tourneyGames, playoffGames = arg.playoffGames, gameTime = arg.gameTime, restTime = arg.restTime, areas = arg.areas, playoffTime = arg.playoffTime, playoffRest = arg.playoffRest;
  calcAreaLength = function(games) {
    return Math.floor(games / areas) + games % areas;
  };
  tourneyAreaLength = calcAreaLength(tourneyGames);
  playoffAreaLength = calcAreaLength(playoffGames);
  return tourneyAreaLength * (gameTime + restTime) + playoffAreaLength * (playoffTime + playoffRest);
};
