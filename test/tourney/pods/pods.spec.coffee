{expect} = require '../../spec-helper'
_ = require 'underscore'

pods = require 'tourney/pods'

describe 'tourney/pods', ->
  it 'given no params throws', ->
    expect(pods).to.throw "You must provide either the number of teams or a list of team names"

  it 'given no teams returns zero', ->
    expect(pods(0)).to.eql { games: 0, schedule: [], divisions: [], pods: {} }

  it 'given 1 team returns zero', ->
    expect(pods(1)).to.eql { games: 0, schedule: [], divisions: [], pods: {"1":[1]} }

  it 'given 2 teams returns 2 games with numbers for names', ->
    expect(pods(2)).to.eql
      games: 1
      schedule: [{id:"Pod 1 Game 10", round:1,teams:[2,1]}]
      divisions: []
      pods: {"1": [1,2]}

  it 'given 3 teams returns 3 games with numbers for names', ->
    expect(pods(3)).to.eql
      games: 3
      schedule: [{id:"Pod 1 Game 10",round:1,teams:[3,2]},{id:"Pod 1 Game 20",round:2,teams:[1,3]},{id:"Pod 1 Game 30",round:3,teams:[2,1]}]
      divisions: []
      pods: {"1": [1,2,3]}

  it 'given 4 teams returns 6 games', ->
    expect(pods(4).games).to.eq 6

  describe 'given 8 teams', ->
    {games, schedule, divisions, numPods} = {}

    beforeEach ->
      {games, schedule, divisions, pods: numPods } = pods(8)

    it 'returns 22 games', ->
      expect(games).to.eq 22

    it 'returns 2 pods', ->
      expect(Object.keys(numPods).length).to.eq 2

    it 'returns 4 divisions', ->
      expect(divisions.length).to.eq 4

    it 'splits the tournament into two pods', ->
      expect(schedule.indexOf (game) -> game.id is "Pod 1 Game 10").to.be.ok
      expect(schedule.indexOf (game) -> game.id is "Pod 2 Game 10").to.be.ok

    it 'has games for each division', ->
      expect(schedule.indexOf (game) -> game.id is "Div 1 Game 1").to.be.ok
      expect(schedule.indexOf (game) -> game.id is "Div 2 Game 1").to.be.ok
      expect(schedule.indexOf (game) -> game.id is "Div 3 Game 1").to.be.ok
      expect(schedule.indexOf (game) -> game.id is "Div 4 Game 1").to.be.ok

    it 'has crossover games for each division', ->
      expect(schedule.indexOf (game) -> game.id is "Div 1/2 <--1-->").to.be.ok
      expect(schedule.indexOf (game) -> game.id is "Div 2/3 <--1-->").to.be.ok
      expect(schedule.indexOf (game) -> game.id is "Div 3/4 <--1-->").to.be.ok

  it 'given 12 teams returns 36 games', ->
    expect(pods(12).games).to.eq 36

  it 'given 16 teams returns 48 games', ->
    expect(pods(16).games).to.eq 54

  describe 'given 20 teams', ->
    {games, schedule, divisions, numPods} = {}

    beforeEach ->
      {games, schedule, divisions, pods: numPods } = pods(20)

    it 'returns 76 games', ->
      expect(games).to.eq 76

    it 'returns 5 pods', ->
      expect(Object.keys(numPods).length).to.eq 5

    it 'returns 4 divisions', ->
      expect(divisions.length).to.eq 4

