import { expect } from '../spec-helper';
import roundRobin from '@lib/tourney/round-robin'; // Using path alias
import { Game } from '@lib/tourney-time'; // Assuming types

interface RoundRobinResult<T = number | string> {
  games: number;
  schedule: Game[];
  teams: T[];
}

describe('tourney/round-robin', () => {
  it('given no params throws', () => {
    expect(() => (roundRobin as any)()).to.throw(
      'You must provide either the number of teams or a list of team names',
    );
  });

  describe('given number of teams', () => {
    it('given no teams returns zero games', () => {
      expect(roundRobin(0)).to.eql({ games: 0, schedule: [], teams: [] });
    });

    it('given 1 team returns zero', () => {
      expect(roundRobin(1)).to.eql({ games: 0, schedule: [], teams: [1] });
    });

    describe('given 2 teams', () => {
      let result: RoundRobinResult<number>;

      beforeEach(() => {
        result = roundRobin(2);
      });

      it('returns 1 game', () => {
        expect(result.games).to.eq(1);
      });

      it('returns correct schedule', () => {
        expect(result.schedule).to.eql([
          { id: 10, round: 1, teams: [2, 1] as any },
        ]);
      });

      it('returns correct teams', () => {
        expect(result.teams).to.eql([1, 2]);
      });
    });

    describe('given 3 teams', () => {
      let result: RoundRobinResult<number>;

      beforeEach(() => {
        result = roundRobin(3);
      });

      it('returns 3 games', () => {
        expect(result.games).to.eq(3);
      });

      it('returns correct schedule', () => {
        expect(result.schedule).to.eql([
          { id: 10, round: 1, teams: [3, 2] as any },
          { id: 20, round: 2, teams: [1, 3] as any },
          { id: 30, round: 3, teams: [2, 1] as any },
        ]);
      });

      it('returns correct teams', () => {
        expect(result.teams).to.eql([1, 2, 3]);
      });
    });

    it('given 4 teams returns 6 games', () => {
      expect(roundRobin(4).games).to.eq(6);
    });

    it('given 8 teams returns 28 games', () => {
      expect(roundRobin(8).games).to.eql(28);
    });

    it('given 12 teams returns 66 games', () => {
      // Corrected expectation from 28 to 66
      expect(roundRobin(12).games).to.eql(66);
    });

    it('given 16 teams returns 120 games', () => {
      expect(roundRobin(16).games).to.eql(120);
    });
  });

  describe('given team names', () => {
    it('given 1 team returns zero', () => {
      expect(roundRobin(['goodie'])).to.eql({
        games: 0,
        schedule: [],
        teams: ['goodie'],
      });
    });

    it('given 2 teams returns 1 game with correct names', () => {
      // Corrected games from 2 to 1
      expect(roundRobin(['a', 'b'])).to.eql({
        games: 1,
        schedule: [{ id: 10, round: 1, teams: ['b', 'a'] }],
        teams: ['a', 'b'],
      });
    });

    describe('given 3 teams', () => {
      let result: RoundRobinResult<string>;

      beforeEach(() => {
        result = roundRobin(['a', 'b', 'c']);
      });

      it('returns 3 games', () => {
        expect(result.games).to.eq(3);
      });

      it('returns correct schedule', () => {
        expect(result.schedule).to.eql([
          { id: 10, round: 1, teams: ['c', 'b'] },
          { id: 20, round: 2, teams: ['a', 'c'] },
          { id: 30, round: 3, teams: ['b', 'a'] },
        ]);
      });

      it('returns correct teams', () => {
        expect(result.teams).to.eql(['a', 'b', 'c']);
      });
    });
  });
});
