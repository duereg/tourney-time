#!/usr/bin/env coffee

_ = require('underscore')

argv = require('yargs')
  .usage('Usage: $0 --teams [num]')
  .demand(['teams'])
  .argv

class Tournament
  constructor: (@teams) ->
    @rounds = []

    for round in [1...@teams]
      @rounds.push new Round round, teams

class Round
  constructor: (@round, @teams) ->
    @pairs = []

    for i in [1..@teams / 2]
      if i is 1
        @pairs.push(new Pair(1, (round + teams - i - 1) % (teams - 1) + 2, round))
      else
        @pairs.push(new Pair((round + i - 2) % (teams - 1) + 2, (round + teams - i - 1) % (teams - 1) + 2, round))

class Pair
  constructor: (one, two, round) ->
    @one = if round % 2 is 1 then one else two
    @two = if round % 2 is 1 then two else one

tourney = new Tournament(argv.teams)

games = _(tourney.rounds)
  .chain()
  .map (round) -> round.pairs
  .flatten()
  .map (pair) -> [pair.one, pair.two]
  .value()

console.log(games)

for i in [0 .. games.length - 1]
  console.log("this balancer overlaps!") if _.intersection(games[i], games[i+1]).length
