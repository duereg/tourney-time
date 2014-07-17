module.exports = function(_arg) {
  var areas, games, rest, teams, time, timeNeeded;
  teams = _arg.teams, time = _arg.time, rest = _arg.rest, areas = _arg.areas;
  games = teams - (teams % 4);
  timeNeeded = (games * (time + rest)) / areas;
  return {
    games: games,
    timeNeeded: timeNeeded
  };
};
