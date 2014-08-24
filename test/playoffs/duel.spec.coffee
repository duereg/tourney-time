{expect} = require '../spec-helper'

duel = require 'playoffs/duel'

emtptyTourney = {type: 'knockout', games: 0, schedule: []}

fiveTeamSchedule = [
  {"id":312,round:1,"teams":["Seed 5","Seed 4"]}
  {"id":321,round:2,"teams":["Seed 1","Winner 312"]}
  {"id":322,round:2,"teams":["Seed 3","Seed 2"]}
  {"id":331,round:3,"teams":["Loser 321","Loser 322"]}
  {"id":332,round:3,"teams":["Winner 321","Winner 322"]}
]

thirteenTeamSchedule = [
  { "id": 412,round:1, "teams": ["Seed 9", "Seed 8"] }
  { "id": 413,round:1, "teams": ["Seed 5", "Seed 12"] }
  { "id": 414,round:1, "teams": ["Seed 13", "Seed 4"] }
  { "id": 416,round:1, "teams": ["Seed 11", "Seed 6"] }
  { "id": 417,round:1, "teams": ["Seed 7", "Seed 10"] }
  { "id": 421,round:2, "teams": ["Seed 1", "Winner 412"] }
  { "id": 422,round:2, "teams": ["Winner 413", "Winner 414"] }
  { "id": 423,round:2, "teams": ["Seed 3", "Winner 416"] }
  { "id": 424,round:2, "teams": ["Winner 417", "Seed 2"] }
  { "id": 431,round:3, "teams": ["Winner 421", "Winner 422"] }
  { "id": 432,round:3, "teams": ["Winner 423", "Winner 424"] }
  { "id": 441,round:4, "teams": ["Loser 431", "Loser 432"] }
  { "id": 442,round:4, "teams": ["Winner 431", "Winner 432"] }
]

describe 'playoffs/duel', ->
  it 'given no params, throws', ->
    expect(duel).to.throw 'You must provide the number of teams to continue.'

  it 'given no teams returns an empty tournament', ->
    expect(duel(0)).to.eql emtptyTourney

  it 'given 1 team returns an empty tournament', ->
    expect(duel(1)).to.eql emtptyTourney

  it 'given 2 teams returns 1 game', ->
    expect(duel(2).games).to.eq 1

  it 'given 2 teams returns the correct schedule', ->
    expect(duel(2).schedule).to.eql [{"id": 111, round: 1, "teams": ["Seed 1", "Seed 2"]}]

  it 'given 3 teams returns 2 games', ->
    expect(duel(3).games).to.eq 2

  it 'given 4 teams returns 4 games', ->
    expect(duel(4).games).to.eql 4

  it 'given 5 teams return 5 games', ->
    expect(duel(5).games).to.eq 5

  it 'given 5 teams returns the correct schedule', ->
    expect(duel(5).schedule).to.eql fiveTeamSchedule

  it 'given 6 teams return 6 games', ->
    expect(duel(6).games).to.eq 6

  it 'given 8 teams return 8 games', ->
    expect(duel(8).games).to.eql 8

  it 'given 9 teams return 8 games', ->
    expect(duel(9).games).to.eq 9

  it 'given 12 teams return 12 games', ->
    expect(duel(12).games).to.eq 12

  it 'given 13 teams returns 13 games', ->
    expect(duel(13).games).to.eq 13

  it 'given 13 teams returns the correct schedule', ->
    expect(duel(13).schedule).to.eql thirteenTeamSchedule
