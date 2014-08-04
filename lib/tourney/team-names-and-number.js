module.exports = function(teams) {
  var names;
  if (arguments.length === 0) {
    throw new Error("You must provide either the number of teams or a list of team names");
  }
  names = null;
  if (teams != null ? teams.length : void 0) {
    names = teams;
    teams = teams.length;
  }
  return {
    names: names,
    teams: teams
  };
};
