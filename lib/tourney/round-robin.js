var getTeamNamesAndNumber, robinSchedule, _;

getTeamNamesAndNumber = require('./team-names-and-number');

robinSchedule = require('roundrobin');

_ = require('underscore');

module.exports = function(teams) {
  var games, names, schedule, _ref;
  _ref = getTeamNamesAndNumber.apply(null, arguments), teams = _ref.teams, names = _ref.names;
  schedule = _(robinSchedule(teams, names)).flatten(true);
  games = schedule.length;
  return {
    games: games,
    schedule: schedule,
    teams: names
  };
};
