require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
expect = chai.expect
chai.use require 'sinon-chai'

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
      expect( () -> multiAreaSchedule({tourneySchedule: null}) ).to.throw "You provide a tournament schedule to continue"

    it 'given no games to schedule returns []', ->
      expect(multiAreaSchedule(args)).to.eql []

    it 'given an empty schedule returns []', ->
      args.tourneySchedule.schedule = []
      expect(multiAreaSchedule(args)).to.eql []

    describe 'given a one game schedule', ->
      beforeEach ->
        args.tourneySchedule.schedule = [[1,2]]
        args.tourneySchedule.games = 1

      it 'returns the one game', ->
        expect(multiAreaSchedule(args)).to.eql [[[1,2]]]

    describe 'given a three game schedule', ->
      beforeEach ->
        args.tourneySchedule.schedule = [[2,3], [1,3], [1,2]]
        args.tourneySchedule.games = 3

      it 'returns three rounds of games, as a team cannot play twice in the same round', ->
        results = multiAreaSchedule(args)
        expect(results).to.eql [[[2,3]], [[1,3]], [[1,2]]]

    describe 'given a six game schedule', ->
      beforeEach ->
        args.tourneySchedule.schedule = [[1,4],[2,3],[1,3],[4,2],[1,2],[3,4]]
        args.tourneySchedule.games = 3

      it 'returns three rounds of games', ->
        results = multiAreaSchedule(args)
        expect(results).to.eql [[[1,4],[2,3]],[[1,3],[4,2]],[[1,2],[3,4]]]
