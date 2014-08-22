require '../spec-helper'

multiAreaSchedule = require 'schedule/multiple'

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
        args.tourneySchedule.schedule = [[1,2]]
        args.tourneySchedule.games = 1

      it 'returns the one game', ->
        expect(multiAreaSchedule(args)).to.eql [[[1,2]]]

      describe 'and a one game playoff schedule', ->
        beforeEach ->
          args.playoffSchedule.schedule = [[1,2]]
          args.playoffSchedule.games = 1

        it 'returns two games in two rounds', ->
          expect(multiAreaSchedule(args)).to.eql [[[1,2]], [[1,2]]]

    describe 'given a three game tournament schedule', ->
      beforeEach ->
        args.tourneySchedule.schedule = [[2,3], [1,3], [1,2]]
        args.tourneySchedule.games = 3

      it 'returns three rounds of games, as a team cannot play twice in the same round', ->
        results = multiAreaSchedule(args)
        expect(results).to.eql [[[2,3]], [[1,3]], [[1,2]]]

      describe 'and a two game playoff schedule', ->
        beforeEach ->
          args.playoffSchedule.schedule = [[4,5], [6,7]]
          args.playoffSchedule.games = 2

        it 'returns five games in five rounds', ->
          expect(multiAreaSchedule(args)).to.eql [[[2,3]], [[1,3]], [[1,2]], [[4,5], [6,7]]]

    describe 'given a six game tournament schedule', ->
      beforeEach ->
        args.tourneySchedule.schedule = [[1,4],[2,3],[1,3],[4,2],[1,2],[3,4]]
        args.tourneySchedule.games = 3

      it 'returns three rounds of games', ->
        results = multiAreaSchedule(args)
        expect(results).to.eql [[[1,4],[2,3]],[[1,3],[4,2]],[[1,2],[3,4]]]

      describe 'and a four game playoff schedule', ->
        beforeEach ->
          args.playoffSchedule.schedule = [[1,4], [2,3], ['W1','W2'], ['L1','L2']]
          args.playoffSchedule.games = 2

        it 'returns ten games in seven rounds', ->
          #[[[1,4],[2,3]],[[1,3],[4,2]],[[1,2],[3,4]],[[1,4],[2,3]],[['W1','W2'],['L1','L2']]]
          expect(multiAreaSchedule(args)).to.eql [[[1,4],[2,3]],[[1,3],[4,2]],[[1,2],[3,4]],[[1,4],[2,3]],[["W1","W2"],["L1","L2"]]]

