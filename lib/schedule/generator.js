var multipleArea, singleArea;

singleArea = require('./single');

multipleArea = require('./multiple');

module.exports = function(arg) {
  var areas, playoffSchedule, tourneySchedule;
  tourneySchedule = arg.tourneySchedule, playoffSchedule = arg.playoffSchedule, areas = arg.areas;
  if (areas === 1) {
    return singleArea({
      tourneySchedule: tourneySchedule,
      playoffSchedule: playoffSchedule
    });
  } else {
    return multipleArea({
      tourneySchedule: tourneySchedule,
      playoffSchedule: playoffSchedule,
      areas: areas
    });
  }
};
