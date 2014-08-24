{expect} = require '../spec-helper'

multiAreaSchedule = require 'schedule/multiple'

singleGameSchedule = [{id:10,round:1,teams:[2,1]}]
threeGameSchedule = [{id:10,round:1,teams:[3,2]},{id:20,round:2,teams:[1,3]},{id:30,round:3,teams:[2,1]}]
threeGameResults = [[{id:10,round:1,teams:[3,2]}],[{id:20,round:2,teams:[1,3]}],[{id:30,round:3,teams:[2,1]}]]
sixGameSchedule = [
  {"teams":[4,1],"round":1,"id":10},
  {"teams":[3,2],"round":1,"id":11},
  {"teams":[1,3],"round":2,"id":20},
  {"teams":[4,2],"round":2,"id":21},
  {"teams":[2,1],"round":3,"id":30},
  {"teams":[4,3],"round":3,"id":31}
]
fourGamePlayoff = [
  {"id":211,"round":1,"teams":["Seed 1","Seed 4"]},
  {"id":212,"round":1,"teams":["Seed 3","Seed 2"]},
  {"id":221,"round":2,"teams":["Loser 211","Loser 212"]},
  {"id":222,"round":2,"teams":["Winner 211","Winner 212"]}
]
fourGameResults = [
  [{"id":211,"round":1,"teams":["Seed 1","Seed 4"]},{"id":212,"round":1,"teams":["Seed 3","Seed 2"]}],
  [{"id":221,"round":2,"teams":["Loser 211","Loser 212"]}, {"id":222,"round":2,"teams":["Winner 211","Winner 212"]}]
]
sixGameResults = [
  [{"teams":[4,1],"round":1,"id":10}, {"teams":[3,2],"round":1,"id":11}],
  [{"teams":[1,3],"round":2,"id":20}, {"teams":[4,2],"round":2,"id":21}],
  [{"teams":[2,1],"round":3,"id":30}, {"teams":[4,3],"round":3,"id":31}]
]

describe 'schedule/multiple', ->
  {tourneySchedule, playoffSchedule, areas, args} = {}

  beforeEach ->
    tourneySchedule = {type: 'round robin', games: 0}
    playoffSchedule = {type: 'knockout', games: 0}
    args = {tourneySchedule, playoffSchedule, areas}

  describe 'with two areas', ->
    beforeEach ->
      areas = 2

    it 'give no params, throws', ->
      expect(multiAreaSchedule).to.throw "Cannot read property 'tourneySchedule' of undefined"

    it 'given a tourneySchedule param set to null, throws', ->
      expect( () -> multiAreaSchedule({tourneySchedule: null}) ).to.throw "You must provide a tournament schedule to continue"

    it 'given a playoffSchedule param set to null, throws', ->
      expect( () -> multiAreaSchedule({tourneySchedule, playoffSchedule: null}) ).to.throw "You must provide a playoff schedule to continue"

    it 'given no games to schedule returns []', ->
      expect(multiAreaSchedule(args)).to.eql []

    describe 'given an empty tournament schedule', ->
      beforeEach ->
        args.tourneySchedule.schedule = []

      it 'returns []', ->
        expect(multiAreaSchedule(args)).to.eql []

      describe 'and an empty playoff schedule', ->
        beforeEach ->
          args.playoffSchedule.schedule = []

        it 'returns []', ->
          expect(multiAreaSchedule(args)).to.eql []

    describe 'given a one game tournament schedule', ->
      beforeEach ->
        args.tourneySchedule.schedule = singleGameSchedule
        args.tourneySchedule.games = 1

      it 'returns the one game', ->
        expect(multiAreaSchedule(args)).to.eql [singleGameSchedule]

      describe 'and a one game playoff schedule', ->
        beforeEach ->
          args.playoffSchedule.schedule = singleGameSchedule
          args.playoffSchedule.games = 1

        it 'returns two games in two rounds', ->
          expect(multiAreaSchedule(args)).to.eql [singleGameSchedule, singleGameSchedule]

    describe 'given a three game tournament schedule', ->
      beforeEach ->
        args.tourneySchedule.schedule = threeGameSchedule
        args.tourneySchedule.games = 3

      it 'returns three rounds of games, as a team cannot play twice in the same round', ->
        results = multiAreaSchedule(args)
        expect(results).to.eql threeGameResults

      describe 'and a two game playoff schedule, where the same teams play in the same round', ->
        beforeEach ->
          args.playoffSchedule.schedule = [{id:40,round:1,teams:[3,2]},{id:50,round:1,teams:[1,3]}]
          args.playoffSchedule.games = 2

        it 'returns five games in five rounds', ->
          expect(multiAreaSchedule(args)).to.eql threeGameResults.concat [[{id:40,round:1,teams:[3,2]}],[{id:50,round:1,teams:[1,3]}]]

      describe 'and a two game playoff schedule, where the different teams play in the different rounds', ->
        beforeEach ->
          args.playoffSchedule.schedule = [{id:40,round:1,teams:[3,2]},{id:50,round:2,teams:[4,1]}]
          args.playoffSchedule.games = 2

        it 'returns five games in five rounds', ->
          expect(multiAreaSchedule(args)).to.eql threeGameResults.concat [[{id:40,round:1,teams:[3,2]}],[{id:50,round:2,teams:[4,1]}]]

    describe 'given a six game tournament schedule', ->
      beforeEach ->
        args.tourneySchedule.schedule = sixGameSchedule
        args.tourneySchedule.games = 6

      it 'returns three rounds of games', ->
        results = multiAreaSchedule(args)
        expect(results).to.eql sixGameResults

      describe 'and a four game playoff schedule', ->
        beforeEach ->
          args.playoffSchedule.schedule = fourGamePlayoff
          args.playoffSchedule.games = 4

        it 'returns ten games in seven rounds', ->
          expect(multiAreaSchedule(args)).to.eql sixGameResults.concat fourGameResults

