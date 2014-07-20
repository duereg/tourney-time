require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
expect = chai.expect
chai.use require 'sinon-chai'

roundRobin = require 'regular/round-robin'

describe 'round robin', ->
  it 'given no teams returns zero', ->
    expect(roundRobin(0)).to.eq 0

  it 'given 1 team returns zero', ->
    expect(roundRobin(1)).to.eq 0

  it 'given 2 teams returns 2', ->
    expect(roundRobin(2)).to.eq 1

  it 'given 3 teams returns 3', ->
    expect(roundRobin(3)).to.eq 3

  it 'given 4 teams returns 6', ->
    expect(roundRobin(4)).to.eq 6

  it 'given 8 teams returns 28', ->
    expect(roundRobin(8)).to.eq 28

  it 'given 12 teams returns 28', ->
    expect(roundRobin(12)).to.eq 66

  it 'given 16 teams returns 120', ->
    expect(roundRobin(16)).to.eq 120
