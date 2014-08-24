{expect} = require '../spec-helper'

selector = require 'tourney/selector'

describe 'tourney/selector', ->
  results = null

  describe 'given number of teams less than 9', ->
    beforeEach ->
      results = selector(2,1)

    it 'returns object with type "round robin"', ->
      expect(results.type).to.eq 'round robin'

    it 'returns object containing number of games', ->
      expect(results.games).to.eq 1

    it 'returns object containing a schedule', ->
      expect(results.schedule).to.eql [{id:10,round:1,teams:[2,1]}]

    it 'returns object containing number of areas', ->
      expect(results.areas).to.eq 1

  describe 'given number of teams greater than 8', ->
    describe 'and number of areas less than teams / 4', ->
      beforeEach ->
        results = selector(9, 2)

      it 'returns object with type "pods"', ->
        expect(results.type).to.eq 'pods'

      it 'returns object containing number of games', ->
        expect(results.games).to.eq 22

      it 'returns object containing a schedule', ->
        expect(results.schedule).to.be.ok

      it 'returns object containing number of areas', ->
        expect(results.areas).to.eq 2

    describe 'and number of areas > teams / 4 but <= teams / 2', ->
      beforeEach ->
        results = selector(10, 4)

      it 'returns object with type "round robin"', ->
        expect(results.type).to.eq 'round robin'

      it 'returns object containing number of games', ->
        expect(results.games).to.eq 45

      it 'returns object containing a schedule', ->
        expect(results.schedule).to.be.ok

      it 'returns object containing number of areas', ->
        expect(results.areas).to.eq 4

    describe 'and number of areas > teams / 2', ->
      beforeEach ->
        results = selector(10, 10)

      it 'reduces number of areas to teams / 2', ->
        expect(results.areas).to.eq 5
