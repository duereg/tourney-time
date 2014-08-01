require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
expect = chai.expect
chai.use require 'sinon-chai'

standardSchedule = require 'schedule/single'

describe 'schedule/single', ->
  {tourneySchedule, playoffGames, areas, args} = {}

  beforeEach ->
    tourneySchedule = {type: 'round robin'}
    playoffGames = 0
    areas = 1
    args = {tourneySchedule, playoffGames, areas}

  it 'given no games to schedule returns []', ->
    expect(standardSchedule(args)).to.eql []

  it 'given an empty schedule returns []', ->
    args.tourneySchedule.schedule = []
    expect(standardSchedule(args)).to.eql []

  describe 'given a one game schedule', ->
    beforeEach ->
      args.tourneySchedule.schedule = [[1,2]]
      args.tourneySchedule.games = 1

    it 'returns the one game', ->
      expect(standardSchedule(args)).to.eql [[1,2]]

  describe 'given a three game schedule', ->
    beforeEach ->
      args.tourneySchedule.schedule = [[1,2], [1,3], [2,3]]
      args.tourneySchedule.games = 3

    it 'returns the three games', ->
      expect(standardSchedule(args)).to.eql [[1,2], [1,3], [2,3]]
