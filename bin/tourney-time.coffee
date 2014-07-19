#!/usr/bin/env coffee

argv = require('yargs')
  .usage('Usage: $0 --teams [num] --time [num] --rest [num] --areas [num]')
  .demand(['teams'])
  .default('time', 33)
  .default('rest', 7)
  .default('areas', 1)
  .argv

{teams, time, rest, areas} = argv
{timeNeededMinutes, regularGames, playoffGames} = require('../lib/tourney-time')(argv)

hours = Math.floor(timeNeededMinutes / 60)
minutes = timeNeededMinutes % 60

console.log """For #{teams} teams
               Playing #{time} minute games
               with #{rest} minute breaks in between games
               on #{areas} playing area(s)
               you'll play #{regularGames + playoffGames} total games (#{regularGames} regular games and #{playoffGames} playoff games)
               which will take #{hours} hours, #{minutes} minutes """
