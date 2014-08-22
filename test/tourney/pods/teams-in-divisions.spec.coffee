{expect} = require '../../spec-helper'

teamsInDivisions = require 'tourney/pods/teams-in-divisions'

firstDivision = [
    "1st : Pod 1",
    "1st : Pod 2",
    "1st : Pod 3"
  ]

secondDivision = [
    "2nd : Pod 1",
    "2nd : Pod 2",
    "2nd : Pod 3"
  ]

thirdDivision = [
    "3rd : Pod 1",
    "3rd : Pod 2",
    "3rd : Pod 3",
  ]

partialFourthDivision = [
  "4th : Pod 1",
  "4th : Pod 2",
]

fourthDivision = partialFourthDivision.slice()
fourthDivision.push("4th : Pod 3")

magicThirdDivision = thirdDivision.slice()
magicThirdDivision.push("4th : Pod 1")

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

    it 'given 2 pods of 4 teams, returns four divisions', ->
      expect(teamsInDivisions({'1': [1,2,3,4], '2': [5,6,7,8]}).length).to.eq 4

    it 'given 9 teams for pods of 3 teams, returns 3 divisions worth of games', ->
      expect(teamsInDivisions({"1": [1,4,7], "2": [2,5,8], "3": [3,6,9]})).to.eql nineTeamDivisions

    it 'given 10 teams for pods of 4 teams, returns 3 divisions worth of games', ->
      expect(teamsInDivisions({"1": [1,4,7,10], "2": [2,5,8], "3": [3,6,9]})).to.eql tenTeamDivisions

    it 'given 11 teams for pods of 4 teams, returns 4 divisions worth of games', ->
      expect(teamsInDivisions({"1": [1,4,7,10], "2": [2,5,8,11], "3": [3,6,9]})).to.eql elevenTeamDivisions

    it 'given 12 teams for pods of 4 teams, returns 4 divisions worth of games', ->
      expect(teamsInDivisions({"1": [1,4,7,10], "2": [2,5,8,11], "3": [3,6,9,12]})).to.eql twelveTeamDivisions
