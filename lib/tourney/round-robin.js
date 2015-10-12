var _, getTeamNamesAndNumber, robinSchedule;

_ = require('underscore');

robinSchedule = require('roundrobin');

getTeamNamesAndNumber = require('./team-names-and-number');

module.exports = function(teams) {
  var addedRounds, games, names, ref, schedule, unflattenedSchedule;
  ref = getTeamNamesAndNumber.apply(null, arguments), teams = ref.teams, names = ref.names;
  unflattenedSchedule = robinSchedule(teams, names);
  addedRounds = _(unflattenedSchedule).map(function(round, roundIndex) {
    return _(round).map(function(teams, gameIndex) {
      var daRound;
      daRound = roundIndex + 1;
      return {
        teams: teams,
        round: daRound,
        id: parseInt(daRound.toString() + gameIndex.toString())
      };
    });
  });
  schedule = _(addedRounds).flatten(true);
  games = schedule.length;
  return {
    games: games,
    schedule: schedule,
    teams: names
  };
};
