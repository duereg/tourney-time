require 'coffee-errors'

chai = require 'chai'
sinon = require 'sinon'
expect = chai.expect
chai.use require 'sinon-chai'

duel = require 'playoffs/duel'

fiveTeamSchedule = [
  {"id":312,"teams":["Seed 5","Seed 4"]}
  {"id":321,"teams":["Seed 1","Winner 312"]}
  {"id":322,"teams":["Seed 3","Seed 2"]}
  {"id":331,"teams":["Loser 321","Loser 322"]}
  {"id":332,"teams":["Winner 321","Winner 322"]}
]

thirteenTeamSchedule = [
  { "id": 412, "teams": ["Seed 9", "Seed 8"] }
  { "id": 413, "teams": ["Seed 5", "Seed 12"] }
  { "id": 414, "teams": ["Seed 13", "Seed 4"] }
  { "id": 416, "teams": ["Seed 11", "Seed 6"] }
  { "id": 417, "teams": ["Seed 7", "Seed 10"] }
  { "id": 421, "teams": ["Seed 1", "Winner 412"] }
  { "id": 422, "teams": ["Winner 413", "Winner 414"] }
  { "id": 423, "teams": ["Seed 3", "Winner 416"] }
  { "id": 424, "teams": ["Winner 417", "Seed 2"] }
  { "id": 431, "teams": ["Winner 421", "Winner 422"] }
  { "id": 432, "teams": ["Winner 423", "Winner 424"] }
  { "id": 441, "teams": ["Loser 431", "Loser 432"] }
  { "id": 442, "teams": ["Winner 431", "Winner 432"] }
]

describe 'playoffs/duel', ->
  it 'given no params, throws', ->
    expect(duel).to.throw 'You must provide the number of teams to continue.'

  it 'given no teams returns zero', ->
    expect(duel(0)).to.eql []

  it 'given 1 team returns zero', ->
    expect(duel(1)).to.eql []

  it 'given 2 teams returns 1 game', ->
    expect(duel(2).length).to.eq 1

  it 'given 2 teams returns the correct schedule', ->
    expect(duel(2)).to.eql [{"id": 111, "teams": ["Seed 1", "Seed 2"]}]

  it 'given 3 teams returns 2 games', ->
    expect(duel(3).length).to.eq 2

  it 'given 4 teams returns 4 games', ->
    expect(duel(4).length).to.eql 4

  it 'given 5 teams return 5 games', ->
    expect(duel(5).length).to.eq 5

  it 'given 5 teams returns the correct schedule', ->
    expect(duel(5)).to.eql fiveTeamSchedule

  it 'given 6 teams return 6 games', ->
    expect(duel(6).length).to.eq 6

  it 'given 8 teams return 8 games', ->
    expect(duel(8).length).to.eql 8

  it 'given 9 teams return 8 games', ->
    expect(duel(9).length).to.eq 9

  it 'given 12 teams return 12 games', ->
    expect(duel(12).length).to.eq 12

  it 'given 13 teams returns 13 games', ->
    expect(duel(13).length).to.eq 13

  it 'given 13 teams returns the correct schedule', ->
    expect(duel(13)).to.eql thirteenTeamSchedule