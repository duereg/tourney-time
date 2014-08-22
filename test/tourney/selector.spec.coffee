{expect} = require '../spec-helper'

selector = require 'tourney/selector'

describe 'tourney/selector', ->
  describe 'given number of teams less than 9', ->
    it 'returns object with type "round robin"', ->
      expect(selector(2).type).to.eq 'round robin'

    it 'returns object containing number of games', ->
      expect(selector(2).games).to.eq 1

    it 'returns object containing a schedule', ->
      expect(selector(2).schedule).to.eql [[1,2]]

  describe 'given number of teams greater than 8', ->
    it 'returns object with type "round robin"', ->
      expect(selector(9).type).to.eq 'pods'

    it 'returns object containing number of games', ->
      expect(selector(9).games).to.eq 22

    it 'returns object containing a schedule', ->
      expect(selector(9).schedule).to.be.ok
