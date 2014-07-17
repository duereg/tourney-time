module.exports = function(_arg) {
  var areas, playoffGames, rest, roundRobinGames, teams, time, timeNeeded, totalGames;
  teams = _arg.teams, time = _arg.time, rest = _arg.rest, areas = _arg.areas;
  roundRobinGames = teams + ((teams - 1) * teams) / 2;
  playoffGames = teams - (teams % 4);
  totalGames = roundRobinGames + playoffGames;
  timeNeeded = (totalGames * (time + rest)) / areas;
  return {
    roundRobinGames: roundRobinGames,
    playoffGames: playoffGames,
    totalGames: totalGames,
    timeNeededMinutes: timeNeeded
  };
};
