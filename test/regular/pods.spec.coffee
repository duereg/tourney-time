require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
expect = chai.expect
chai.use require 'sinon-chai'

pods = require 'regular/pods'

describe 'pods', ->
  it 'given no teams returns zero', ->
    expect(pods(0)).to.eq 0

  it 'given 1 team returns zero', ->
    expect(pods(1)).to.eq 0

  it 'given 2 teams returns 2', ->
    expect(pods(2)).to.eq 1

  it 'given 3 teams returns 3', ->
    expect(pods(3)).to.eq 3

  it 'given 4 teams returns 6', ->
    expect(pods(4)).to.eq 6

  it 'given 8 teams return 26', ->
    expect(pods(8)).to.eq 22

  it 'given 12 teams return 36', ->
    expect(pods(12)).to.eq 36

  it 'given 16 teams returns 48', ->
    expect(pods(16)).to.eq 54

  it 'given 20 teams returns 70', ->
    expect(pods(20)).to.eq 76
