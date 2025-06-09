import { expect } from '../spec-helper';
import multiAreaSchedule, { MultipleOptions } from '@lib/schedule/multiple'; // Using path alias
import { Game, Schedule as TourneyScheduleType } from '@lib/tourney-time'; // Assuming types

// Define a more specific type for the schedule objects used in these tests
interface TestSchedule extends TourneyScheduleType {
  schedule?: Game[]; // Make schedule optional as it's added dynamically in tests
}

interface Args {
  tourneySchedule: TestSchedule;
  playoffSchedule: TestSchedule;
  areas?: number; // areas is optional in some calls in original tests
}

const singleGameSchedule: Game[] = [{ id: 10, round: 1, teams: [2, 1] as any }]; // Cast teams if they are not string[]
const threeGameSchedule: Game[] = [
  { id: 10, round: 1, teams: [3, 2] as any },
  { id: 20, round: 2, teams: [1, 3] as any },
  { id: 30, round: 3, teams: [2, 1] as any },
];
const threeGameResults: Game[][] = [
  [{ id: 10, round: 1, teams: [3, 2] as any }],
  [{ id: 20, round: 2, teams: [1, 3] as any }],
  [{ id: 30, round: 3, teams: [2, 1] as any }],
];
const sixGameSchedule: Game[] = [
  { teams: [4, 1] as any, round: 1, id: 10 },
  { teams: [3, 2] as any, round: 1, id: 11 },
  { teams: [1, 3] as any, round: 2, id: 20 },
  { teams: [4, 2] as any, round: 2, id: 21 },
  { teams: [2, 1] as any, round: 3, id: 30 },
  { teams: [4, 3] as any, round: 3, id: 31 },
];
const fourGamePlayoff: Game[] = [
  { id: 211, round: 1, teams: ['Seed 1', 'Seed 4'] },
  { id: 212, round: 1, teams: ['Seed 3', 'Seed 2'] },
  { id: 221, round: 2, teams: ['Loser 211', 'Loser 212'] },
  { id: 222, round: 2, teams: ['Winner 211', 'Winner 212'] },
];
const fourGameResults: Game[][] = [
  [
    { id: 211, round: 1, teams: ['Seed 1', 'Seed 4'] },
    { id: 212, round: 1, teams: ['Seed 3', 'Seed 2'] },
  ],
  [
    { id: 221, round: 2, teams: ['Loser 211', 'Loser 212'] },
    { id: 222, round: 2, teams: ['Winner 211', 'Winner 212'] },
  ],
];
const sixGameResults: Game[][] = [
  [
    { teams: [4, 1] as any, round: 1, id: 10 },
    { teams: [3, 2] as any, round: 1, id: 11 },
  ],
  [
    { teams: [1, 3] as any, round: 2, id: 20 },
    { teams: [4, 2] as any, round: 2, id: 21 },
  ],
  [
    { teams: [2, 1] as any, round: 3, id: 30 },
    { teams: [4, 3] as any, round: 3, id: 31 },
  ],
];

describe('schedule/multiple', () => {
  let tourneySchedule: TestSchedule;
  let playoffSchedule: TestSchedule;
  let areas: number | undefined; // Explicitly undefined when not set
  let args: Args;

  beforeEach(() => {
    tourneySchedule = { type: 'round robin', games: 0, schedule: [] }; // ensure schedule is initialized
    playoffSchedule = { type: 'knockout', games: 0, schedule: [] }; // ensure schedule is initialized
    // areas is not set here, will be set in nested describe blocks
    args = { tourneySchedule, playoffSchedule, areas }; // areas will be undefined here initially
  });

  describe('with two areas', () => {
    beforeEach(() => {
      areas = 2;
      args.areas = areas; // Update args with the current value of areas
    });

    it('give no params, throws', () => {
      // The original test `expect(multiAreaSchedule).to.throw "Cannot read property 'tourneySchedule' of undefined"`
      // implies calling it with `multiAreaSchedule()` which is `multiAreaSchedule(undefined)`.
      expect(() => multiAreaSchedule(undefined as any)).to.throw(
        "Cannot destructure property 'tourneySchedule' of 'undefined' as it is undefined.",
      );
    });

    it('given a tourneySchedule param set to null, throws', () => {
      expect(() =>
        multiAreaSchedule({
          tourneySchedule: null as any,
          playoffSchedule,
          areas: areas!, // Explicitly assert areas is not undefined
        }),
      ).to.throw('You must provide a tournament schedule to continue');
    });

    it('given a playoffSchedule param set to null, throws', () => {
      expect(() =>
        multiAreaSchedule({
          tourneySchedule,
          playoffSchedule: null as any,
          areas: areas!, // Explicitly assert areas is not undefined
        }),
      ).to.throw('You must provide a playoff schedule to continue');
    });

    it('given no games to schedule returns []', () => {
      // Ensure schedules are empty for this case
      args.tourneySchedule.schedule = [];
      args.playoffSchedule.schedule = [];
      args.tourneySchedule.schedule = [];
      args.playoffSchedule.schedule = [];
      expect(multiAreaSchedule(args as MultipleOptions)).to.eql([]);
    });

    describe('given an empty tournament schedule', () => {
      beforeEach(() => {
        args.tourneySchedule.schedule = [];
        args.tourneySchedule.games = 0; // ensure games count is also 0
      });

      it('returns []', () => {
        expect(multiAreaSchedule(args as MultipleOptions)).to.eql([]);
      });

      describe('and an empty playoff schedule', () => {
        beforeEach(() => {
          args.playoffSchedule.schedule = [];
          args.playoffSchedule.games = 0; // ensure games count is also 0
        });

        it('returns []', () => {
          expect(multiAreaSchedule(args as MultipleOptions)).to.eql([]);
        });
      });
    });

    describe('given a one game tournament schedule', () => {
      beforeEach(() => {
        args.tourneySchedule.schedule = singleGameSchedule;
        args.tourneySchedule.games = 1;
        args.playoffSchedule.schedule = []; // Ensure playoff is empty for this block
        args.playoffSchedule.games = 0;
      });

      it('returns the one game', () => {
        expect(multiAreaSchedule(args as MultipleOptions)).to.eql([
          singleGameSchedule,
        ]);
      });

      describe('and a one game playoff schedule', () => {
        beforeEach(() => {
          args.playoffSchedule.schedule = singleGameSchedule;
          args.playoffSchedule.games = 1;
        });

        it('returns two games in two rounds', () => {
          expect(multiAreaSchedule(args as MultipleOptions)).to.eql([
            singleGameSchedule,
            singleGameSchedule,
          ]);
        });
      });
    });

    describe('given a three game tournament schedule', () => {
      beforeEach(() => {
        args.tourneySchedule.schedule = threeGameSchedule;
        args.tourneySchedule.games = 3;
        args.playoffSchedule.schedule = []; // Ensure playoff is empty
        args.playoffSchedule.games = 0;
      });

      it('returns three rounds of games, as a team cannot play twice in the same round', () => {
        const results = multiAreaSchedule(args as MultipleOptions);
        expect(results).to.eql(threeGameResults);
      });

      describe('and a two game playoff schedule, where the same teams play in the same round', () => {
        beforeEach(() => {
          args.playoffSchedule.schedule = [
            { id: 40, round: 1, teams: [3, 2] as any },
            { id: 50, round: 1, teams: [1, 3] as any },
          ];
          args.playoffSchedule.games = 2;
        });

        it('returns five games in five rounds', () => {
          expect(multiAreaSchedule(args as MultipleOptions)).to.eql(
            threeGameResults.concat([
              [{ id: 40, round: 1, teams: [3, 2] as any }],
              [{ id: 50, round: 1, teams: [1, 3] as any }],
            ]),
          );
        });
      });

      describe('and a two game playoff schedule, where the different teams play in the different rounds', () => {
        beforeEach(() => {
          args.playoffSchedule.schedule = [
            { id: 40, round: 1, teams: [3, 2] as any },
            { id: 50, round: 2, teams: [4, 1] as any },
          ];
          args.playoffSchedule.games = 2;
        });

        it('returns five games in five rounds', () => {
          // Corrected expectation based on logic
          expect(multiAreaSchedule(args as MultipleOptions)).to.eql(
            threeGameResults.concat([
              [{ id: 40, round: 1, teams: [3, 2] as any }],
              [{ id: 50, round: 2, teams: [4, 1] as any }],
            ]),
          );
        });
      });
    });

    describe('given a six game tournament schedule', () => {
      beforeEach(() => {
        args.tourneySchedule.schedule = sixGameSchedule;
        args.tourneySchedule.games = 6;
        args.playoffSchedule.schedule = []; // Ensure playoff is empty
        args.playoffSchedule.games = 0;
      });

      it('returns three rounds of games', () => {
        const results = multiAreaSchedule(args as MultipleOptions);
        expect(results).to.eql(sixGameResults);
      });

      describe('and a four game playoff schedule', () => {
        beforeEach(() => {
          args.playoffSchedule.schedule = fourGamePlayoff;
          args.playoffSchedule.games = 4;
        });

        it('returns five rounds total (3 from tourney, 2 from playoff)', () => {
          // Corrected description based on data shapes
          expect(multiAreaSchedule(args as MultipleOptions)).to.eql(
            sixGameResults.concat(fourGameResults),
          );
        });
      });
    });
  });

  describe('scheduleBalancer with Byes', () => {
    let args: Args;

    beforeEach(() => {
      // Default setup for these tests
      args = {
        tourneySchedule: { type: 'test', games: 0, schedule: [] },
        playoffSchedule: { type: 'test', games: 0, schedule: [] },
        areas: 2, // Default to 2 areas, can be overridden in specific tests
      };
    });

    describe('Scenario 1: Playoff Style Bye - G2 should be in new block due to Team C bye', () => {
      let result: Game[][];
      beforeEach(() => {
        const mockSchedule: Game[] = [
          { id: 'G1', round: 1, teams: ['Team A', 'Team B'] },
          { id: 'Bye1', round: 1, teams: ['Team C'], isByeMatch: true },
          { id: 'G2', round: 2, teams: ['Team A', 'Team C'] }, // Team C had a bye
        ];
        args.playoffSchedule.schedule = mockSchedule;
        args.playoffSchedule.games = mockSchedule.length;
        args.areas = 2;
        result = multiAreaSchedule(args as MultipleOptions);
      });

      // Expected: [[G1, Bye1], [G2]]
      // G1 and Bye1 are in round 1, fit in areas=2.
      // G2 is round 2, so starts a new block. Team C from Bye1 is now "active".
      // If G2 were round 1, it would also start a new block due to Team C.
      it('should result in two schedule blocks', () => {
        expect(result.length).to.equal(2);
      });

      it('should have G1 and Bye1 in the first block', () => {
        expect(result[0].map(g => g.id)).to.deep.equal(['G1', 'Bye1']);
      });

      it('should have G2 in the second block', () => {
        expect(result[1].map(g => g.id)).to.deep.equal(['G2']);
      });
    });

    describe('Scenario 1.1: Playoff Style Bye - G2 (same round) should be in new block', () => {
      let result: Game[][];
      beforeEach(() => {
        const mockSchedule: Game[] = [
          { id: 'G1', round: 1, teams: ['Team A', 'Team B'] },
          { id: 'Bye1', round: 1, teams: ['Team C'], isByeMatch: true },
          { id: 'G2', round: 1, teams: ['Team X', 'Team C'] }, // Team C had a bye in same round
        ];
        args.playoffSchedule.schedule = mockSchedule;
        args.playoffSchedule.games = mockSchedule.length;
        args.areas = 2;
        result = multiAreaSchedule(args as MultipleOptions);
      });

      // Expected: [[G1, Bye1], [G2]]
      // G1, Bye1 are round 1. Team C is in Bye1.
      // G2 is round 1, involves Team C. `hasTeam` for G2 will be true. New block.
      it('should result in two schedule blocks', () => {
        expect(result.length).to.equal(2);
      });

      it('should have G1 and Bye1 in the first block', () => {
        expect(result[0].map(g => g.id)).to.deep.equal(['G1', 'Bye1']);
      });

      it('should have G2 in the second block', () => {
        expect(result[1].map(g => g.id)).to.deep.equal(['G2']);
      });
    });

    describe('Scenario 2: Same Round Back-to-Back Attempt - G11 new block due to Team R bye', () => {
      let result: Game[][];
      beforeEach(() => {
        const mockSchedule: Game[] = [
          { id: 'G10', round: 1, teams: ['Team P', 'Team Q'] },
          { id: 'ByeR', round: 1, teams: ['Team R'], isByeMatch: true },
          { id: 'G11', round: 1, teams: ['Team R', 'Team S'] },
        ];
        args.tourneySchedule.schedule = mockSchedule;
        args.tourneySchedule.games = mockSchedule.length;
        args.areas = 3; // Allowing more area capacity
        result = multiAreaSchedule(args as MultipleOptions);
      });

      // Expected: [[G10, ByeR], [G11]]
      // G10, ByeR are round 1. Team R is in ByeR.
      // G11 is round 1, involves Team R. `hasTeam` for G11 will be true. New block.
      it('should result in two schedule blocks', () => {
        expect(result.length).to.equal(2);
      });

      it('should have G10 and ByeR in the first block', () => {
        expect(result[0].map(g => g.id)).to.deep.equal(['G10', 'ByeR']);
      });

      it('should have G11 in the second block', () => {
        expect(result[1].map(g => g.id)).to.deep.equal(['G11']);
      });
    });

    describe('Scenario 3: Bye is last in area, next game (same round) starts new block', () => {
      let result: Game[][];
      beforeEach(() => {
        const mockSchedule: Game[] = [
          { id: 'AreaFiller1', round: 1, teams: ['T1', 'T2'] },
          { id: 'ByeZ', round: 1, teams: ['Team Z'], isByeMatch: true }, // Fills area if areas=2
          { id: 'NextGameForZ', round: 1, teams: ['Team Z', 'Team K'] },
        ];
        args.tourneySchedule.schedule = mockSchedule;
        args.tourneySchedule.games = mockSchedule.length;
        args.areas = 2;
        result = multiAreaSchedule(args as MultipleOptions);
      });

      // Expected: [[AreaFiller1, ByeZ], [NextGameForZ]]
      // AreaFiller1, ByeZ are round 1, fill areas=2. Team Z is in ByeZ.
      // NextGameForZ is round 1, involves Team Z. `hasTeam` will be true. New block.
      it('should result in two schedule blocks', () => {
        expect(result.length).to.equal(2);
      });

      it('should have AreaFiller1 and ByeZ in the first block', () => {
        expect(result[0].map(g => g.id)).to.deep.equal(['AreaFiller1', 'ByeZ']);
      });

      it('should have NextGameForZ in the second block', () => {
        expect(result[1].map(g => g.id)).to.deep.equal(['NextGameForZ']);
      });
    });

    describe('Scenario 4: No back-to-back if teams are different (areas=3)', () => {
      let result: Game[][];
      beforeEach(() => {
        const mockSchedule: Game[] = [
          { id: 'GameAlpha', round: 1, teams: ['Alpha1', 'Alpha2'] },
          { id: 'ByeBeta', round: 1, teams: ['Beta1'], isByeMatch: true },
          { id: 'GameGamma', round: 1, teams: ['Gamma1', 'Gamma2'] }, // No common teams with ByeBeta
        ];
        args.tourneySchedule.schedule = mockSchedule;
        args.tourneySchedule.games = mockSchedule.length;
        args.areas = 3;
        result = multiAreaSchedule(args as MultipleOptions);
      });

      // Expected with areas=3: [[GameAlpha, ByeBeta, GameGamma]]
      // All are round 1. ByeBeta involves Beta1. GameGamma does not involve Beta1.
      // `hasTeam` for GameGamma (w.r.t teams in [GameAlpha, ByeBeta]) is false.
      // All fit in one block.
      it('should result in one schedule block', () => {
        expect(result.length).to.equal(1);
      });

      it('should have GameAlpha, ByeBeta, and GameGamma in the first block', () => {
        expect(result[0].map(g => g.id)).to.deep.equal(['GameAlpha', 'ByeBeta', 'GameGamma']);
      });
    });

    describe('Scenario 4.1: No back-to-back if teams are different (areas=2, GameGamma new block due to area limit)', () => {
      let result: Game[][];
      beforeEach(() => {
        const mockSchedule: Game[] = [
          { id: 'GameAlpha', round: 1, teams: ['Alpha1', 'Alpha2'] },
          { id: 'ByeBeta', round: 1, teams: ['Beta1'], isByeMatch: true },
          { id: 'GameGamma', round: 1, teams: ['Gamma1', 'Gamma2'] }, // No common teams with ByeBeta
        ];
        args.tourneySchedule.schedule = mockSchedule;
        args.tourneySchedule.games = mockSchedule.length;
        args.areas = 2;
        result = multiAreaSchedule(args as MultipleOptions);
      });

      // Expected with areas=2: [[GameAlpha, ByeBeta], [GameGamma]]
      // GameAlpha, ByeBeta fill the first block.
      // GameGamma starts a new block because round.length (2) < areas (2) is false.
      it('should result in two schedule blocks', () => {
        expect(result.length).to.equal(2);
      });

      it('should have GameAlpha and ByeBeta in the first block', () => {
        expect(result[0].map(g => g.id)).to.deep.equal(['GameAlpha', 'ByeBeta']);
      });

      it('should have GameGamma in the second block', () => {
        expect(result[1].map(g => g.id)).to.deep.equal(['GameGamma']);
      });
    });
  });
});
