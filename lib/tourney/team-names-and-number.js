module.exports = function(teams) {
  var name, names, _i, _ref;
  if (arguments.length === 0) {
    throw new Error("You must provide either the number of teams or a list of team names");
  }
  names = null;
  if (teams != null ? teams.length : void 0) {
    names = teams;
    teams = teams.length;
  } else {
    names = [];
    for (name = _i = 1, _ref = teams + 1; 1 <= _ref ? _i < _ref : _i > _ref; name = 1 <= _ref ? ++_i : --_i) {
      names.push(name);
    }
  }
  return {
    names: names,
    teams: teams
  };
};
