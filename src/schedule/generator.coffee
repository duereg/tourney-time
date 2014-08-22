singleArea = require './single'
multipleArea = require './multiple'

module.exports = ({tourneySchedule, playoffSchedule, areas}) ->
  if areas is 1
    singleArea {tourneySchedule, playoffSchedule}
  else
    multipleArea {tourneySchedule, playoffSchedule, areas}
