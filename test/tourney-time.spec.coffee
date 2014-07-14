require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
# using compiled JavaScript file here to be sure module works
tourneyTime = require '../lib/tourney-time.js'

expect = chai.expect
chai.use require 'sinon-chai'

describe 'tourney-time', ->
  it 'works', ->
    actual = tourneyTime 'World'
    expect(actual).to.eql 'Hello World'
