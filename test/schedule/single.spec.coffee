{expect} = require '../spec-helper'

standardSchedule = require 'schedule/single'

describe 'schedule/single', ->
  {tourneySchedule, playoffSchedule, areas, args} = {}

  beforeEach ->
    tourneySchedule = {type: 'round robin'}
    playoffSchedule = {type: 'knockout'}
    areas = 1
    args = {tourneySchedule, playoffSchedule, areas}

  it 'give no params, throws', ->
    expect(standardSchedule).to.throw "Cannot read property 'tourneySchedule' of undefined"

  it 'given a tourneySchedule param set to null, throws', ->
    expect( () -> standardSchedule({tourneySchedule: null}) ).to.throw "You must provide a tournament schedule to continue"

  it 'given a playoffSchedule param set to null, throws', ->
    expect( () -> standardSchedule({tourneySchedule, playoffSchedule: null}) ).to.throw "You must provide a playoff schedule to continue"

  it 'given no games to schedule returns []', ->
    expect(standardSchedule(args)).to.eql []

  describe 'given an empty tournament schedule', ->
    beforeEach ->
      args.tourneySchedule.schedule = []

    it 'returns []', ->
      expect(standardSchedule(args)).to.eql []

    describe 'and an empty playoff schedule', ->
      beforeEach ->
        args.playoffSchedule.schedule = []

      it 'returns []', ->
        expect(standardSchedule(args)).to.eql []

  describe 'given a one game tournament schedule', ->
    beforeEach ->
      args.tourneySchedule.schedule = [[1,2]]
      args.tourneySchedule.games = 1

    it 'returns one game', ->
      expect(standardSchedule(args)).to.eql [[1,2]]

    describe 'and a one game playoff schedule', ->
      beforeEach ->
        args.playoffSchedule.schedule = [[1,2]]
        args.playoffSchedule.games = 1

      it 'returns two games', ->
        expect(standardSchedule(args)).to.eql [[1,2], [1,2]]

  describe 'given a three game schedule', ->
    beforeEach ->
      args.tourneySchedule.schedule = [[1,2], [1,3], [2,3]]
      args.tourneySchedule.games = 3

    it 'returns three games', ->
      expect(standardSchedule(args)).to.eql [[1,2], [1,3], [2,3]]

    describe 'and a two game playoff schedule', ->
      beforeEach ->
        args.playoffSchedule.schedule = [[4,5], [6,7]]
        args.playoffSchedule.games = 2

      it 'returns five games', ->
        expect(standardSchedule(args)).to.eql [[1,2], [1,3], [2,3], [4,5], [6,7]]

