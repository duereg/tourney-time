module.exports = function(teams) {
  var i, name, names, ref;
  if (arguments.length === 0) {
    throw new Error("You must provide either the number of teams or a list of team names");
  }
  names = [];
  if (teams != null ? teams.length : void 0) {
    names = teams;
    teams = teams.length;
  } else if (teams) {
    for (name = i = 1, ref = teams; i <= ref; name = i += 1) {
      names.push(name);
    }
  }
  if (teams == null) {
    teams = 0;
  }
  return {
    names: names,
    teams: teams
  };
};
