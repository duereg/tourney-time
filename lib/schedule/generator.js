var multipleArea, singleArea;

singleArea = require('./single');

multipleArea = require('./multiple');

module.exports = function(_arg) {
  var areas, playoffSchedule, tourneySchedule;
  tourneySchedule = _arg.tourneySchedule, playoffSchedule = _arg.playoffSchedule, areas = _arg.areas;
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
