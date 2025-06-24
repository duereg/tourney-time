import { expect } from '../spec-helper';
import standardSchedule from '@lib/schedule/single'; // Using path alias
import { Game, Schedule as TourneyScheduleType } from '@lib/tourney-time'; // Assuming types

// Define a more specific type for the schedule objects used in these tests
interface TestSchedule extends TourneyScheduleType {
  schedule?: Game[]; // Make schedule optional as it's added dynamically in tests
}

interface Args {
  tourneySchedule: TestSchedule;
  playoffSchedule: TestSchedule;
  // areas?: number; // areas is not used by singleAreaSchedule
}

describe('schedule/single', () => {
  let tourneySchedule: TestSchedule;
  let playoffSchedule: TestSchedule;
  // let areas: number | undefined; // Not needed if not in Args
  let args: Args;

  beforeEach(() => {
    tourneySchedule = { type: 'round robin', games: 0, schedule: [] }; // Initialize schedule
    playoffSchedule = { type: 'knockout', games: 0, schedule: [] }; // Initialize schedule
    // areas = 1; // Default for single area schedule - not needed for standardSchedule
    args = { tourneySchedule, playoffSchedule };
  });

  it('give no params, throws', () => {
    // Original test implies calling standardSchedule() which is standardSchedule(undefined)
    expect(() => standardSchedule(undefined as any)).to.throw(
      "Cannot destructure property 'tourneySchedule' of 'undefined' as it is undefined.",
    );
  });

  it('given a tourneySchedule param set to null, throws', () => {
    expect(() =>
      standardSchedule({
        tourneySchedule: null as any,
        playoffSchedule,
        // areas, // Removed as it's not part of SingleOptions
      }),
    ).to.throw('You must provide a tournament schedule to continue');
  });

  it('given a playoffSchedule param set to null, throws', () => {
    expect(() =>
      standardSchedule({
        tourneySchedule,
        playoffSchedule: null as any,
        // areas, // Removed as it's not part of SingleOptions
      }),
    ).to.throw('You must provide a playoff schedule to continue');
  });

  it('given no games to schedule returns []', () => {
    // Ensure schedules are explicitly empty for this test
    args.tourneySchedule.schedule = [];
    args.playoffSchedule.schedule = [];
    expect(standardSchedule(args)).to.eql([]);
  });

  describe('given an empty tournament schedule', () => {
    beforeEach(() => {
      args.tourneySchedule.schedule = [];
      args.tourneySchedule.games = 0;
    });

    it('returns []', () => {
      expect(standardSchedule(args)).to.eql([]);
    });

    describe('and an empty playoff schedule', () => {
      beforeEach(() => {
        args.playoffSchedule.schedule = [];
        args.playoffSchedule.games = 0;
      });

      it('returns []', () => {
        expect(standardSchedule(args)).to.eql([]);
      });
    });
  });

  describe('given a one game tournament schedule', () => {
    const game1: Game = { id: 1, round: 1, teams: [1, 2] as any }; // Sample game

    beforeEach(() => {
      args.tourneySchedule.schedule = [game1];
      args.tourneySchedule.games = 1;
      args.playoffSchedule.schedule = []; // Ensure playoff is empty
      args.playoffSchedule.games = 0;
    });

    it('returns one game', () => {
      expect(standardSchedule(args)).to.eql([game1]);
    });

    describe('and a one game playoff schedule', () => {
      const game2: Game = { id: 2, round: 1, teams: [1, 2] as any }; // Sample game
      beforeEach(() => {
        args.playoffSchedule.schedule = [game2];
        args.playoffSchedule.games = 1;
      });

      it('returns two games', () => {
        expect(standardSchedule(args)).to.eql([game1, game2]);
      });
    });
  });

  describe('given a three game schedule', () => {
    const gamesTourney: Game[] = [
      { id: 1, round: 1, teams: [1, 2] as any },
      { id: 2, round: 1, teams: [1, 3] as any },
      { id: 3, round: 1, teams: [2, 3] as any },
    ];
    beforeEach(() => {
      args.tourneySchedule.schedule = gamesTourney;
      args.tourneySchedule.games = 3;
      args.playoffSchedule.schedule = []; // Ensure playoff is empty
      args.playoffSchedule.games = 0;
    });

    it('returns three games', () => {
      expect(standardSchedule(args)).to.eql(gamesTourney);
    });

    describe('and a two game playoff schedule', () => {
      const gamesPlayoff: Game[] = [
        { id: 4, round: 2, teams: [4, 5] as any },
        { id: 5, round: 2, teams: [6, 7] as any },
      ];
      beforeEach(() => {
        args.playoffSchedule.schedule = gamesPlayoff;
        args.playoffSchedule.games = 2;
      });

      it('returns five games', () => {
        expect(standardSchedule(args)).to.eql(
          gamesTourney.concat(gamesPlayoff),
        );
      });
    });
  });

  describe('back-to-back game annotation', () => {
    it('should not annotate if no games are back-to-back', () => {
      const games: Game[] = [
        { id: 1, round: 1, teams: ['A', 'B'] },
        { id: 2, round: 2, teams: ['C', 'D'] },
        { id: 3, round: 3, teams: ['A', 'C'] },
      ];
      args.tourneySchedule.schedule = games;
      args.playoffSchedule.schedule = [];
      const result = standardSchedule(args);
      expect(result).to.deep.equal(games.map(g => ({...g}))); // Cloned, no backToBackTeams
      result.forEach(game => {
        expect(game.backToBackTeams).to.be.undefined;
      });
    });

    it('should annotate a simple back-to-back game', () => {
      const games: Game[] = [
        { id: 1, round: 1, teams: ['A', 'B'] },
        { id: 2, round: 2, teams: ['A', 'C'] }, // A plays back-to-back
      ];
      args.tourneySchedule.schedule = games;
      args.playoffSchedule.schedule = [];
      const result = standardSchedule(args);

      expect(result[0].backToBackTeams).to.be.undefined;
      expect(result[1].backToBackTeams).to.deep.equal(['A']);
    });

    it('should correctly clone games and then annotate', () => {
      const originalGame1: Game = { id: 1, round: 1, teams: ['A', 'B'] };
      const originalGame2: Game = { id: 2, round: 2, teams: ['A', 'C'] };
      args.tourneySchedule.schedule = [originalGame1, originalGame2];
      args.playoffSchedule.schedule = [];
      const result = standardSchedule(args);

      expect(result[0]).to.not.equal(originalGame1); // Should be a clone
      expect(result[1]).to.not.equal(originalGame2); // Should be a clone
      expect(result[1].backToBackTeams).to.deep.equal(['A']);
      // Ensure original games are not mutated
      expect(originalGame1.backToBackTeams).to.be.undefined;
      expect(originalGame2.backToBackTeams).to.be.undefined;
    });

    it('should annotate multiple back-to-back games', () => {
      const games: Game[] = [
        { id: 1, round: 1, teams: ['A', 'B'] },
        { id: 2, round: 2, teams: ['A', 'C'] }, // A is b2b
        { id: 3, round: 3, teams: ['C', 'D'] }, // C is b2b
        { id: 4, round: 4, teams: ['B', 'E'] }, // No b2b here
        { id: 5, round: 5, teams: ['E', 'A'] }, // E is b2b, A is not from game 2
      ];
      args.tourneySchedule.schedule = games;
      args.playoffSchedule.schedule = [];
      const result = standardSchedule(args);

      expect(result[0].backToBackTeams).to.be.undefined;
      expect(result[1].backToBackTeams).to.deep.equal(['A']);
      expect(result[2].backToBackTeams).to.deep.equal(['C']);
      expect(result[3].backToBackTeams).to.be.undefined;
      expect(result[4].backToBackTeams).to.deep.equal(['E']);
    });

    it('should handle empty schedule for annotation', () => {
      args.tourneySchedule.schedule = [];
      args.playoffSchedule.schedule = [];
      const result = standardSchedule(args);
      expect(result).to.eql([]);
    });

    it('should handle schedule with one game for annotation', () => {
      const games: Game[] = [{ id: 1, round: 1, teams: ['A', 'B'] }];
      args.tourneySchedule.schedule = games;
      args.playoffSchedule.schedule = [];
      const result = standardSchedule(args);
      expect(result[0].backToBackTeams).to.be.undefined;
      expect(result).to.deep.equal([{...games[0]}]);
    });

    it('should correctly annotate when games come from both tourney and playoff schedules', () => {
      const tourneyGames: Game[] = [
        { id: 1, round: 1, teams: ['A', 'B'] },
      ];
      const playoffGames: Game[] = [
        { id: 2, round: 2, teams: ['A', 'C'] }, // A plays b2b with game 1
        { id: 3, round: 3, teams: ['C', 'D'] }, // C plays b2b with game 2
      ];
      args.tourneySchedule.schedule = tourneyGames;
      args.playoffSchedule.schedule = playoffGames;
      const result = standardSchedule(args);

      expect(result.length).to.equal(3);
      expect(result[0].backToBackTeams).to.be.undefined; // Game 1 (A,B)
      expect(result[1].backToBackTeams).to.deep.equal(['A']); // Game 2 (A,C)
      expect(result[2].backToBackTeams).to.deep.equal(['C']); // Game 3 (C,D)
    });

    it('should not annotate if teams are different but a team played much earlier', () => {
        const games: Game[] = [
            { id: 1, round: 1, teams: ['A', 'B'] },
            { id: 2, round: 2, teams: ['C', 'D'] },
            { id: 3, round: 3, teams: ['A', 'E'] }, // A is not b2b with game 1
        ];
        args.tourneySchedule.schedule = games;
        args.playoffSchedule.schedule = [];
        const result = standardSchedule(args);
        expect(result[2].backToBackTeams).to.be.undefined;
    });
  });
});
