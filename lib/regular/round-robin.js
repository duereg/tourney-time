var robinSchedule, _;

robinSchedule = require('roundrobin');

_ = require('underscore');

module.exports = function(teams) {
  var games, schedule;
  schedule = _(robinSchedule(teams)).flatten(true);
  games = schedule.length;
  return {
    games: games,
    schedule: schedule
  };
};
