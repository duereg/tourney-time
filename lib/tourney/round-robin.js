var getTeamNamesAndNumber, robinSchedule, _;

_ = require('underscore');

robinSchedule = require('roundrobin');

getTeamNamesAndNumber = require('./team-names-and-number');

module.exports = function(teams) {
  var games, names, schedule, _ref;
  _ref = getTeamNamesAndNumber.apply(null, arguments), teams = _ref.teams, names = _ref.names;
  schedule = _(robinSchedule(teams, names)).flatten(true);
  games = schedule.length;
  schedule = _(schedule).map(function(teams, index) {
    return {
      id: index + 1,
      teams: teams
    };
  });
  return {
    games: games,
    schedule: schedule,
    teams: names
  };
};
