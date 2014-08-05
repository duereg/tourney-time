module.exports = function(teams) {
  var name, names, _i;
  if (arguments.length === 0) {
    throw new Error("You must provide either the number of teams or a list of team names");
  }
  names = [];
  if (teams != null ? teams.length : void 0) {
    names = teams;
    teams = teams.length;
  } else if (teams) {
    for (name = _i = 1; 1 <= teams ? _i <= teams : _i >= teams; name = 1 <= teams ? ++_i : --_i) {
      names.push(name);
    }
  }
  return {
    names: names,
    teams: teams
  };
};
