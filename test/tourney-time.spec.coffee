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
      expect(tourneyTime).to.throw

  describe 'with two playing areas, 30 min games, and 10 min rest', ->
    defaultTourney = {areas: 2, time: 30, rest: 10}

    describe 'given two teams', ->
      it 'generates correct output', ->
        expect(tourneyTime _(defaultTourney).extend(teams: 2)).to.eql(
          "playoffGames": 0
          "timeNeededMinutes": 40,
          "tourneySchedule":
            "games": 1,
            "type": "round robin"
        )

    describe 'given three teams', ->
      it 'generates correct output', ->
        expect(tourneyTime _(defaultTourney).extend(teams: 3)).to.eql(
          "playoffGames": 0
          "timeNeededMinutes": 80,
          "tourneySchedule":
            "games": 3,
            "type": "round robin"
        )
    describe 'given three teams', ->
      it 'generates correct output', ->
        expect(tourneyTime _(defaultTourney).extend(teams: 4)).to.eql(
          "playoffGames": 4
          "timeNeededMinutes": 200,
          "tourneySchedule":
            "games": 6,
            "type": "round robin"
        )
    describe 'given ten teams, with all options', ->
      it 'generates correct output', ->
        actual = tourneyTime _(defaultTourney).extend teams: 10
        expect(actual).to.eql(
          "playoffGames": 8
          "timeNeededMinutes": 720,
          "tourneySchedule":
            "games": 27,
            "type": "pods"
        )
