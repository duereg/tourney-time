{expect} = require '../../spec-helper'

crossoverSchedule = require 'tourney/pods/crossover-schedule'

firstDivision = [
  "1st Pod 1",
  "1st Pod 2",
  "1st Pod 3"
]

secondDivision = [
  "2nd Pod 1",
  "2nd Pod 2",
  "2nd Pod 3"
]

thirdDivision = [
  "3rd Pod 1",
  "3rd Pod 2",
  "3rd Pod 3",
]

partialFourthDivision = [
  "4th Pod 1",
  "4th Pod 2",
]

oneDivision = [firstDivision]
twoDivisions = [firstDivision, secondDivision]
threeDivisions = [firstDivision, secondDivision, thirdDivision]
fourDivisions = [firstDivision, secondDivision, thirdDivision, fourDivisions]

twoDivisionSchedule = [
  {
    "id": "Div 1/2 <-1->"
    "teams": ["2nd Div 1", "2nd Div 2"]
  }
  {
    "id": "Div 1/2 <-2->"
    "teams": ["3rd Div 1", "1st Div 2"]
  }
]

describe 'tourney/pods/crossoverSchedule', ->
  it 'given no params throws', ->
    expect(crossoverSchedule).to.throw "You must provide divisions to generate the crossover games"

  describe 'given divisions', ->
    it 'given no teams returns empty array', ->
      expect(crossoverSchedule([])).to.eql []

    it 'given 1 division returns an empty array', ->
      expect(crossoverSchedule(oneDivision)).to.eql []

    describe 'given 2 divisions', ->
      schedule = null

      beforeEach ->
        schedule = crossoverSchedule(twoDivisions)

      it 'generates the correct schedule', ->
        expect(schedule).to.eql twoDivisionSchedule

    it 'given 3 divisions, returns four games', ->
      expect(crossoverSchedule(threeDivisions).length).to.eq 4

    it 'given 4 divisions, returns six games', ->
      expect(crossoverSchedule(fourDivisions).length).to.eq 6
