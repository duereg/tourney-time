require 'coffee-errors'
_ = require 'underscore'

chai = require 'chai'
sinon = require 'sinon'
# using compiled JavaScript file here to be sure module works
tourneyTime = require '../lib/tourney-time.js'

expect = chai.expect
chai.use require 'sinon-chai'

describe 'tourney-time', ->
  describe 'given one team', ->
    it 'throws an error', ->
      expect(()-> tourneyTime teams:0).to.throw "You must have at least two teams to continue"

  describe 'with two playing areas, 30 min games, and 10 min rest', ->
    defaultTourney = {areas: 2, time: 30, rest: 10}

    describe 'given two teams', ->
      it 'generates correct output', ->
        expect(tourneyTime _(defaultTourney).extend(teams: 2)).to.eql(
          "playoffGames": 1
          "timeNeededMinutes": 80,
          "schedule": [[[1,2]]],
          "tourneySchedule":
            "games": 1,
            "type": "round robin"
        )

    describe 'given three teams', ->
      it 'generates correct output', ->
        expect(tourneyTime _(defaultTourney).extend(teams: 3)).to.eql(
          "playoffGames": 1
          schedule: [[[2,3]], [[1,3]], [[1,2]]],
          "timeNeededMinutes": 120,
          "tourneySchedule":
            "games": 3,
            "type": "round robin"
        )
    describe 'given four teams', ->
      it 'generates correct output', ->
        expect(tourneyTime _(defaultTourney).extend(teams: 4)).to.eql(
          "playoffGames": 4
          schedule: [[[1,4],[2,3]],[[1,3],[4,2]],[[1,2],[3,4]]],
          "timeNeededMinutes": 200,
          "tourneySchedule":
            "games": 6,
            "type": "round robin"
        )
    describe 'given ten teams, with all options', ->
      {playoffGames, timeNeededMinutes, tourneySchedule, schedule} = {}

      beforeEach ->
        {playoffGames, timeNeededMinutes, tourneySchedule, schedule} = tourneyTime _(defaultTourney).extend teams: 10

      it 'generates 8 playoff games', ->
        expect(playoffGames).to.eq 8

      it 'generates 720 minutes needed', ->
        expect(timeNeededMinutes).to.eq 720

      it 'generates the correct type of tourney schedule', ->
        expect(tourneySchedule).to.eql {games: 28, type: 'pods'}

      it 'generates a schedule containing 14 rounds', ->
        expect(schedule.length).to.eq 14

