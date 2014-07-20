require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
expect = chai.expect
chai.use require 'sinon-chai'

roundRobin = require 'regular/round-robin'

describe 'round robin', ->
  it 'given no teams returns zero games', ->
    expect(roundRobin(0)).to.eql { games: 0, schedule: [] }

  it 'given 1 team returns zero', ->
    expect(roundRobin(1)).to.eql { games: 0, schedule: [] }

  it 'given 2 teams returns 2', ->
    expect(roundRobin(2)).to.eql { games: 1, schedule: [[1,2]] }

  it 'given 3 teams returns 3', ->
    expect(roundRobin(3)).to.eql { games: 3, schedule: [[2,3], [1,3], [1,2]] }

  it 'given 4 teams returns 6', ->
    expect(roundRobin(4).games).to.eq 6

  it 'given 8 teams returns 28', ->
    expect(roundRobin(8).games).to.eql 28

  it 'given 12 teams returns 28', ->
    expect(roundRobin(12).games).to.eql 66

  it 'given 16 teams returns 120', ->
    expect(roundRobin(16).games).to.eql 120
