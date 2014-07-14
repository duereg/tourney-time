#!/usr/bin/env coffee

argv = require('yargs')
  .usage('Usage: $0 -teams [num] -time [num] -rest [num] -areas [num]')
  .demand(['teams'])
  .default('time', 33)
  .default('rest', 7)
  .default('areas', 1)
  .argv

{teams, time, rest, areas} = argv
{timeNeededHumanize} = require('../lib/tourney-time')(argv)

console.log """For #{teams} teams
               Playing #{time} minute games
               with #{rest} minute breaks in between games
               on #{areas} playing area(s)
               you'll need #{timeNeededHumanize} of time"""
