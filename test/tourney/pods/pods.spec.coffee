require '../../spec-helper'

pods = require 'tourney/pods'

describe 'tourney/pods', ->
  it 'given no params throws', ->
    expect(pods).to.throw "You must provide either the number of teams or a list of team names"

  describe 'given number of teams', ->
    it 'given no teams returns zero', ->
      expect(pods(0)).to.eql { games: 0, schedule: [] }

    it 'given 1 team returns zero', ->
      expect(pods(1)).to.eql { games: 0, schedule: [] }

    it 'given 2 teams returns 2 games with numbers for names', ->
      expect(pods(2)).to.eql { games: 1, schedule: [[1,2]] }

    it 'given 3 teams returns 3 games with numbers for names', ->
      expect(pods(3)).to.eql { games: 3, schedule: [[2,3], [1,3], [1,2]] }

    it 'given 4 teams returns 6', ->
      expect(pods(4).games).to.eq 6

    it 'given 8 teams return 22', ->
      expect(pods(8).games).to.eq 22

    it 'given 12 teams return 36', ->
      expect(pods(12).games).to.eq 36

    it 'given 16 teams returns 48', ->
      expect(pods(16).games).to.eq 54

    it 'given 20 teams returns 70', ->
      expect(pods(20).games).to.eq 76
