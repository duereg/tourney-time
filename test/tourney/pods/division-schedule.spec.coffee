require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
expect = chai.expect
chai.use require 'sinon-chai'

divisionSchedule = require 'tourney/pods/division-schedule'

describe 'tourney/pods/divisionSchedule', ->
  it 'given no params throws', ->
    expect(divisionSchedule).to.throw "You must provide an object containing pods to generate the division schedule"
