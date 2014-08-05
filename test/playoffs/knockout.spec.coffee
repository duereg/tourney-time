require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
expect = chai.expect
chai.use require 'sinon-chai'

knockout = require 'playoffs/knockout'

describe 'playoffs/knockout', ->
  it 'given no teams returns zero', ->
    expect(knockout(0)).to.eq 0

  it 'given 1 team returns zero', ->
    expect(knockout(1)).to.eq 0

  it 'given 2 teams returns 1', ->
    expect(knockout(2)).to.eq 1

  it 'given 3 teams returns 1', ->
    expect(knockout(3)).to.eq 1

  it 'given 4 teams returns 4', ->
    expect(knockout(4)).to.eq 4

  it 'given 5 teams return 4', ->
    expect(knockout(5)).to.eq 4

  it 'given 6 teams return 4', ->
    expect(knockout(6)).to.eq 4

  it 'given 8 teams return 8', ->
    expect(knockout(8)).to.eq 8

  it 'given 9 teams return 8', ->
    expect(knockout(9)).to.eq 8
