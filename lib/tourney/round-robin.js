var robinSchedule, _;

robinSchedule = require('roundrobin');

_ = require('underscore');

module.exports = function(teams) {
  var games, names, schedule;
  if (arguments.length === 0) {
    throw new Error("You must provide either the number of teams or a list of team names");
  }
  names = null;
  if (teams != null ? teams.length : void 0) {
    names = teams;
    teams = teams.length;
  }
  schedule = _(robinSchedule(teams, names)).flatten(true);
  games = schedule.length;
  return {
    games: games,
    schedule: schedule
  };
};
