require '../../spec-helper'

crossoverSchedule = require 'tourney/pods/crossover-schedule'

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

oneDivision = [firstDivision]
twoDivisions = [firstDivision, secondDivision]
threeDivisions = [firstDivision, secondDivision, thirdDivision]
fourDivisions = [firstDivision, secondDivision, thirdDivision, fourDivisions]

describe 'tourney/pods/crossoverSchedule', ->
  it 'given no params throws', ->
    expect(crossoverSchedule).to.throw "You must provide divisions to generate the crossover games"

  describe 'given divisions', ->
    it 'given no teams returns empty array', ->
      expect(crossoverSchedule([])).to.eql []

    it 'given 1 division returns an empty array', ->
      expect(crossoverSchedule(oneDivision)).to.eql []

    it 'given 2 divisions, returns two games', ->
      expect(crossoverSchedule(twoDivisions).length).to.eq 2

    it 'given 3 divisions, returns four games', ->
      expect(crossoverSchedule(threeDivisions).length).to.eq 4

    it 'given 4 divisions, returns six games', ->
      expect(crossoverSchedule(fourDivisions).length).to.eq 6
