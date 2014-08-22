#!/usr/bin/env coffee

argv = require('yargs')
  .usage('Usage: $0 --teams [num] --time [num] --rest [num] --areas [num]')
  .demand(['teams'])
  .default('time', 33)
  .default('rest', 7)
  .default('areas', 1)
  .argv

{teams, time, rest, areas} = argv
{timeNeededMinutes, tourneySchedule, playoffSchedule, schedule} = require('../lib/tourney-time')(argv)

hours = Math.floor(timeNeededMinutes / 60)
minutes = timeNeededMinutes % 60

totalTime = ""
totalTime += "#{hours} hours" if hours
totalTime += ', ' if hours and minutes
totalTime += "#{minutes} minutes" if minutes

console.log """For #{teams} teams
               Playing #{time} minute games
               with #{rest} minute breaks in between games
               on #{areas} playing area(s)
               you'll play a #{tourneySchedule.type} tournament and a #{playoffSchedule.type} playoffs
               with #{tourneySchedule.games} tourney games and #{playoffSchedule.games} playoff games
               for #{tourneySchedule.games + playoffSchedule.games} total games
               which will take #{totalTime} """

console.log schedule.map JSON.stringify if schedule?.length
