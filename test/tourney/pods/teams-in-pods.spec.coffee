require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
expect = chai.expect
chai.use require 'sinon-chai'

teamsInPods = require 'tourney/pods/teams-in-pods'

describe 'teams-in-pods', ->
  it 'given no params throws', ->
    expect(teamsInPods).to.throw "You must provide the names of the teams and the number of teams per pod"

  describe 'given number of teams', ->
    it 'given no teams returns empty array', ->
      expect(teamsInPods([], 0)).to.eql {}

    it 'given 1 team returns zero', ->
      expect(teamsInPods([1], 1)).to.eql {'1': [1]}

    it 'given 10 teams for pods of 4 teams, returns 3 pods', ->
      expect(teamsInPods([1..10], 4)).to.eql {"1": [1,4,7,10], "2": [2,5,8], "3": [3,6,9]}
