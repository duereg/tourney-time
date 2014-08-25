#!/usr/bin/env coffee

argv = require('yargs')
  .usage('Usage: $0 --teams [num] --time [num] --rest [num] --areas [num]')
  .demand(['teams'])
  .describe('teams', 'number of players/teams competing')
  .options('t', {
    alias : 'time',
    default : 33,
    describe : 'time in minutes for each tourney game'
  })
  .options('r', {
    alias : 'rest',
    default : 7,
    describe : 'time in minutes between each tourney game'
  })
  .options('a', {
    alias : 'areas',
    default : 1,
    describe : 'number of playing areas available'
  })
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
               on #{tourneySchedule.areas} playing area(s)
               you'll play a #{tourneySchedule.type} tournament and a #{playoffSchedule.type} playoffs
               with #{tourneySchedule.games} tourney games and #{playoffSchedule.games} playoff games
               for #{tourneySchedule.games + playoffSchedule.games} total games
               which will take #{totalTime} """

console.log schedule.map JSON.stringify if schedule?.length
