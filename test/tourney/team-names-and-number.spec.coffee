require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
expect = chai.expect
chai.use require 'sinon-chai'

getTeamNamesAndNumber = require 'tourney/team-names-and-number'

describe 'tourney/team-names-and-number', ->
  describe 'given number of teams', ->
    it 'returns generated names and number of teams', ->
      expect(getTeamNamesAndNumber(2)).to.eql {teams: 2, names: [1, 2]}

  describe 'given names of teams', ->
    it 'returns original names and number of teams', ->
      expect(getTeamNamesAndNumber(['a', 'b'])).to.eql {teams: 2, names: ['a', 'b']}