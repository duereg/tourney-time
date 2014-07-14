require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
# using compiled JavaScript file here to be sure module works
tourneyTime = require '../lib/tourney-time.js'

expect = chai.expect
chai.use require 'sinon-chai'

describe 'tourney-time', ->
  describe 'given all options', ->
    it 'generates correct output', ->
      actual = tourneyTime {teams: 10, time: 30, rest: 10, areas: 2}
      expect(actual).to.eql {"roundRobinGames":55,"playoffGames":8,"totalGames":63,"timeNeededMinutes":1260,"timeNeededHumanize":"21 hours"}
