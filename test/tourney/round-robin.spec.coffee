require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
expect = chai.expect
chai.use require 'sinon-chai'

roundRobin = require 'tourney/round-robin'

describe 'tourney/round-robin', ->
  it 'given no params throws', ->
    expect(roundRobin).to.throw "You must provide either the number of teams or a list of team names"

  describe 'given number of teams', ->
    it 'given no teams returns zero games', ->
      expect(roundRobin(0)).to.eql { games: 0, schedule: [], teams: [] }

    it 'given 1 team returns zero', ->
      expect(roundRobin(1)).to.eql { games: 0, schedule: [], teams: [1] }

    it 'given 2 teams returns 2 games with numbers for names', ->
      expect(roundRobin(2)).to.eql { games: 1, schedule: [[1,2]], teams: [1,2] }

    it 'given 3 teams returns 3 games with numbers for names', ->
      expect(roundRobin(3)).to.eql { games: 3, schedule: [[2,3], [1,3], [1,2]], teams: [1,2,3]}

    it 'given 4 teams returns 6 games', ->
      expect(roundRobin(4).games).to.eq 6

    it 'given 8 teams returns 28 games', ->
      expect(roundRobin(8).games).to.eql 28

    it 'given 12 teams returns 28 games', ->
      expect(roundRobin(12).games).to.eql 66

    it 'given 16 teams returns 120 games', ->
      expect(roundRobin(16).games).to.eql 120

  describe 'given team names', ->
    it 'given 1 team returns zero', ->
      expect(roundRobin(['goodie'])).to.eql { games: 0, schedule: [], teams: ['goodie'] }

    it 'given 2 teams returns 2 games with correct names', ->
      expect(roundRobin(['a', 'b'])).to.eql { games: 1, schedule: [['a','b']], teams: ['a', 'b'] }

    it 'given 3 teams returns 3 games with correct names', ->
      expect(roundRobin(['a', 'b', 'c'])).to.eql { games: 3, schedule: [['b','c'], ['a','c'], ['a','b']], teams: ['a', 'b', 'c'] }
