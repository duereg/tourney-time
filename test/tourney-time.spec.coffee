{expect} = require './spec-helper'
_ = require 'underscore'

tourneyTime = require '../lib/tourney-time'

describe 'tourney-time', ->
  describe 'given one team', ->
    it 'throws an error', ->
      expect(()-> tourneyTime teams:0).to.throw "You must have at least two teams to continue"

  describe 'with one playing area, 20 min games, and 5 minutes rest', ->
    defaultTourney = {areas: 1, time: 20, rest: 5}

    describe 'given two teams', ->
      it 'generates correct output', ->
        expect(tourneyTime _(defaultTourney).extend(teams: 2)).to.eql(
          "timeNeededMinutes": 50,
          "schedule": [{id:10,round:1,teams:[2,1]},{id:111,round:1,teams:["Seed 1","Seed 2"]}],
          "tourneySchedule":
            "games": 1,
            "type": "round robin"
            "areas": 1,
          "playoffSchedule":
            "games": 1
            "type": "knockout"
        )

    describe 'given ten teams, with all options', ->
      {timeNeededMinutes, tourneySchedule, playoffSchedule, schedule} = {}

      beforeEach ->
        {timeNeededMinutes, tourneySchedule, playoffSchedule, schedule} = tourneyTime _(defaultTourney).extend teams: 10

      it 'generates 950 minutes needed', ->
        expect(timeNeededMinutes).to.eq 950

      it 'generates the correct type of tourney schedule', ->
        expect(tourneySchedule).to.eql {games: 28, type: 'pods', areas: 1}

      it 'generates a 10 game playoff schedule', ->
        expect(playoffSchedule).to.eql {games: 10, type: 'knockout'}

      it 'generates a schedule containing 38 rounds', ->
        expect(schedule.length).to.eq 38

  describe 'with two playing areas, 30 min games, and 10 min rest', ->
    defaultTourney = {areas: 2, time: 30, rest: 10}

    describe 'given two teams', ->
      it 'generates correct output', ->
        expect(tourneyTime _(defaultTourney).extend(teams: 2)).to.eql(
          "timeNeededMinutes": 80,
          "schedule": [
            [{id:10,round:1,teams:[2,1]}]
            [{id:111,round:1,teams:["Seed 1","Seed 2"]}]
          ],
          "tourneySchedule":
            "areas": 1,
            "games": 1,
            "type": "round robin"
          "playoffSchedule":
            "games": 1
            "type": "knockout"
        )

    describe 'given three teams', ->
      it 'generates correct output', ->
        expect(tourneyTime _(defaultTourney).extend(teams: 3)).to.eql(
          "schedule": [
            [{id:10,round:1,teams:[3,2]}]
            [{id:20,round:2,teams:[1,3]}]
            [{id:30,round:3,teams:[2,1]}]
            [{id:212,round:1,teams:["Seed 3","Seed 2"]}]
            [{id:221,round:2,teams:["Seed 1","Winner 212"]}]
          ],
          "timeNeededMinutes": 120,
          "tourneySchedule":
            "areas": 1,
            "games": 3,
            "type": "round robin"
          "playoffSchedule":
            "games": 2
            "type": "knockout"
        )
    describe 'given four teams', ->
      {timeNeededMinutes, tourneySchedule, playoffSchedule, schedule} = {}

      beforeEach ->
        {timeNeededMinutes, tourneySchedule, playoffSchedule, schedule} = tourneyTime _(defaultTourney).extend(teams: 4)

      it 'generates a 4 game playoff schedule', ->
        expect(playoffSchedule).to.eql {games: 4, type: 'knockout'}

      it 'generates 200 minutes needed', ->
        expect(timeNeededMinutes).to.eq 200

      it 'generates the 6 game tourney schedule', ->
        expect(tourneySchedule).to.eql {games: 6, type: 'round robin', areas: 2}

      it 'generates a schedule containing 5 rounds', ->
        expect(schedule.length).to.eq 5

    describe 'given ten teams', ->
      {timeNeededMinutes, tourneySchedule, playoffSchedule, schedule} = {}

      beforeEach ->
        {timeNeededMinutes, tourneySchedule, playoffSchedule, schedule} = tourneyTime _(defaultTourney).extend teams: 10

      it 'generates a 10 game playoff schedule', ->
        expect(playoffSchedule).to.eql {games: 10, type: 'knockout'}

      it 'generates 760 minutes needed', ->
        expect(timeNeededMinutes).to.eq 760

      it 'generates a 28 game tourney schedule', ->
        expect(tourneySchedule).to.eql {games: 28, type: 'pods', areas: 2}

      it 'generates a schedule containing 19 rounds', ->
        expect(schedule.length).to.eq 19

