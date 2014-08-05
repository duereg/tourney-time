require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
expect = chai.expect
chai.use require 'sinon-chai'

teamsInDivisions = require 'tourney/pods/teams-in-divisions'

firstDivision = [
    "Pod 1 1st place",
    "Pod 2 1st place",
    "Pod 3 1st place"
  ]

secondDivision = [
    "Pod 1 2nd place",
    "Pod 2 2nd place",
    "Pod 3 2nd place"
  ]

thirdDivision = [
    "Pod 1 3rd place",
    "Pod 2 3rd place",
    "Pod 3 3rd place",
  ]

partialFourthDivision = [
  "Pod 1 4th place",
  "Pod 2 4th place",
]

fourthDivision = partialFourthDivision.slice()
fourthDivision.push("Pod 3 4th place")

magicThirdDivision = thirdDivision.slice()
magicThirdDivision.push("Pod 1 4th place")

nineTeamDivisions = [
    firstDivision,
    secondDivision,
    thirdDivision
  ]

tenTeamDivisions = [
    firstDivision,
    secondDivision,
    magicThirdDivision
  ]

elevenTeamDivisions = [
    firstDivision,
    secondDivision,
    thirdDivision,
    partialFourthDivision
  ]

twelveTeamDivisions = [
    firstDivision,
    secondDivision,
    thirdDivision,
    fourthDivision
  ]

describe 'tourney/pods/teamsInDivisions', ->
  it 'given no params throws', ->
    expect(teamsInDivisions).to.throw "You must provide pods to generate the divisions"

  describe 'given number of teams', ->
    it 'given no teams returns empty array', ->
      expect(teamsInDivisions({})).to.eql []

    it 'given 1 team returns an empty array', ->
      expect(teamsInDivisions({'1': [1]})).to.eql []

    it 'given 2 pods of 4 teams, returns an empty array', ->
      expect(teamsInDivisions({'1': [1,2,3,4], '2': [5,6,7,8]})).to.eql []

    it 'given 9 teams for pods of 3 teams, returns 3 divisions worth of games', ->
      expect(teamsInDivisions({"1": [1,4,7], "2": [2,5,8], "3": [3,6,9]})).to.eql nineTeamDivisions

    it 'given 10 teams for pods of 4 teams, returns 3 divisions worth of games', ->
      expect(teamsInDivisions({"1": [1,4,7,10], "2": [2,5,8], "3": [3,6,9]})).to.eql tenTeamDivisions

    it 'given 11 teams for pods of 4 teams, returns 4 divisions worth of games', ->
      expect(teamsInDivisions({"1": [1,4,7,10], "2": [2,5,8,11], "3": [3,6,9]})).to.eql elevenTeamDivisions

    it 'given 12 teams for pods of 4 teams, returns 4 divisions worth of games', ->
      expect(teamsInDivisions({"1": [1,4,7,10], "2": [2,5,8,11], "3": [3,6,9,12]})).to.eql twelveTeamDivisions
