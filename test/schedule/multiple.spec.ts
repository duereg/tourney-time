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

  describe('Back-to-back scheduling prevention', () => {
    let args: Args;

    beforeEach(() => {
      args = {
        tourneySchedule: { type: 'test', games: 0, schedule: [] },
        playoffSchedule: { type: 'test', games: 0, schedule: [] }, // Keep playoff empty unless specified
        areas: 2, // Default to 2 areas for these tests
      };
    });

    it('should swap games to prevent a team playing back-to-back across rounds', () => {
      // R1G1: A vs B (Area 1), C vs D (Area 2)
      // R1G2: E vs F (Area 1) // This is the last game of Round 1 in Area 1
      // R2G1: F vs G (Area 1) <- Conflict: F plays last in R1 and first in R2
      // R2G2: H vs I (Area 2)
      // R2G3: J vs K (Area 1) <- Potential swap for F vs G
      const tourneyGames: Game[] = [
        // Round 1
        { id: 'R1G1A1', round: 1, teams: ['A', 'B'] },
        { id: 'R1G1A2', round: 1, teams: ['C', 'D'] },
        { id: 'R1G2A1', round: 1, teams: ['E', 'F'] }, // F is in a "last game" of round 1
        // Round 2
        { id: 'R2G1A1', round: 2, teams: ['F', 'G'] }, // F would play back-to-back
        { id: 'R2G1A2', round: 2, teams: ['H', 'I'] },
        { id: 'R2G2A1', round: 2, teams: ['J', 'K'] }, // Available for swap
      ];
      args.tourneySchedule.schedule = tourneyGames;
      args.tourneySchedule.games = tourneyGames.length;
      args.areas = 2;

      const result = multiAreaSchedule(args as MultipleOptions);
      // Expected:
      // Block 1 (Round 1): [R1G1A1, R1G1A2]
      // Block 2 (Round 1): [R1G2A1]
      // Block 3 (Round 2): [R2G2A1 (swapped), R2G1A2] // J vs K, H vs I
      // Block 4 (Round 2): [R2G1A1 (original F vs G)] // F vs G now later
      expect(result.length).to.equal(4);
      expect(result[0].map(g => g.id)).to.deep.equal(['R1G1A1', 'R1G1A2']);
      expect(result[1].map(g => g.id)).to.deep.equal(['R1G2A1']); // E vs F
      expect(result[2].map(g => g.id)).to.deep.equal(['R2G2A1', 'R2G1A2']); // J vs K, H vs I
      expect(result[3].map(g => g.id)).to.deep.equal(['R2G1A1']); // F vs G
      // Verify F is not in the first games of the new round block
      const firstGamesNewRoundBlock = result[2];
      const teamsInFirstGamesNewRoundBlock = firstGamesNewRoundBlock.flatMap(g => g.teams || []);
      expect(teamsInFirstGamesNewRoundBlock).to.not.include('F');
    });

    it('should not swap if no non-conflicting game is available in the same round', () => {
      // R1G1: A vs B (Area 1) // B is in a "last game"
      // R2G1: B vs C (Area 1) <- Conflict
      // R2G2: B vs D (Area 1) <- Also conflict if swapped
      const tourneyGames: Game[] = [
        { id: 'R1G1A1', round: 1, teams: ['A', 'B'] },
        { id: 'R2G1A1', round: 2, teams: ['B', 'C'] },
        { id: 'R2G2A1', round: 2, teams: ['B', 'D'] },
      ];
      args.tourneySchedule.schedule = tourneyGames;
      args.tourneySchedule.games = tourneyGames.length;
      args.areas = 1; // Single area to make it clear

      const result = multiAreaSchedule(args as MultipleOptions);
      // Expected: No swap, conflict remains
      // Block 1: [R1G1A1]
      // Block 2: [R2G1A1] (B vs C)
      // Block 3: [R2G2A1] (B vs D)
      expect(result.length).to.equal(3);
      expect(result[0].map(g => g.id)).to.deep.equal(['R1G1A1']);
      expect(result[1].map(g => g.id)).to.deep.equal(['R2G1A1']); // B vs C
      expect(result[2].map(g => g.id)).to.deep.equal(['R2G2A1']); // B vs D
    });

    it('should handle multiple areas correctly when checking last games', () => {
      // Area 1: R1GA1 (A vs B) | R2GA1 (C vs D)
      // Area 2: R1GA2 (E vs F) | R2GA2 (B vs G) <- Conflict: B played in R1GA1 (Area 1)
      // R2GA3 (H vs I) - available for swap
      const tourneyGames: Game[] = [
        // Round 1
        { id: 'R1GA1', round: 1, teams: ['A', 'B'] }, // B in last game of R1 for Area 1 implicitly
        { id: 'R1GA2', round: 1, teams: ['E', 'F'] }, // F in last game of R1 for Area 2 implicitly
        // Round 2
        { id: 'R2GA2', round: 2, teams: ['B', 'G'] }, // B would play back-to-back (last in R1A1, first in R2A2)
        { id: 'R2GA1', round: 2, teams: ['C', 'D'] }, // Does not conflict with B or F
        { id: 'R2GA3', round: 2, teams: ['H', 'I'] }, // Does not conflict
      ];
      args.tourneySchedule.schedule = tourneyGames;
      args.tourneySchedule.games = tourneyGames.length;
      args.areas = 2;

      const result = multiAreaSchedule(args as MultipleOptions);
      // Expected:
      // Block 1 (R1): [R1GA1, R1GA2] (A vs B, E vs F)
      // Block 2 (R2): [R2GA1, R2GA3] (C vs D, H vs I) - Swapped R2GA2 with R2GA1 or R2GA3
      // Block 3 (R2): [R2GA2] (B vs G)

      // The exact order in block 2 might vary based on which game is chosen for swap first.
      // Key is that 'B vs G' is not in the first set of games for round 2.
      expect(result.length).to.equal(3);
      expect(result[0].map(g => g.id)).to.deep.equal(['R1GA1', 'R1GA2']);

      const firstBlockR2 = result[1];
      const teamsInFirstBlockR2 = firstBlockR2.flatMap(g => g.teams || []);
      expect(teamsInFirstBlockR2).to.not.include('B');
      expect(teamsInFirstBlockR2).to.not.include('F'); // Ensure F also doesn't play back-to-back

      // Check that B vs G is scheduled later
      expect(result[2][0].id).to.equal('R2GA2');
    });

     it('should not swap if the only available games for swap also create a conflict', () => {
      const tourneyGames: Game[] = [
        // Round 1
        { id: 'R1G1A1', round: 1, teams: ['TeamA', 'TeamB'] }, // TeamB is last
        // Round 2
        { id: 'R2G1A1', round: 2, teams: ['TeamB', 'TeamC'] }, // Conflict for TeamB
        { id: 'R2G2A1', round: 2, teams: ['TeamX', 'TeamB'] }, // Swap candidate, but also involves TeamB
      ];
      args.tourneySchedule.schedule = tourneyGames;
      args.tourneySchedule.games = tourneyGames.length;
      args.areas = 1;
      const result = multiAreaSchedule(args as MultipleOptions);
      expect(result[0].map(g => g.id)).to.deep.equal(['R1G1A1']);
      expect(result[1].map(g => g.id)).to.deep.equal(['R2G1A1']); // Original conflicting game
      expect(result[2].map(g => g.id)).to.deep.equal(['R2G2A1']);
    });

    it('should correctly identify last games even if a round has fewer games than areas', () => {
      // R1G1: A vs B (Area 1)
      // R1G2: C vs D (Area 2)
      // R1G3: E vs F (Area 1) - F is in a "last game" of its slot in R1.
      // Areas = 3. R1 has 3 games, spread over 2 blocks.
      // Block1: [A-B, C-D, X-Y] (if X-Y existed)
      // Block2: [E-F]
      // So last games are E-F (from block 2) and C-D (from block 1 area 2). A-B is not last.
      // R2G1: F vs G <- Conflict F
      // R2G2: H vs I
      // R2G3: J vs K <- Swap for F vs G
      const tourneyGames: Game[] = [
        { id: 'R1G1', round: 1, teams: ['A', 'B'] },
        { id: 'R1G2', round: 1, teams: ['C', 'D'] }, // D is in a last game slot
        { id: 'R1G3', round: 1, teams: ['E', 'F'] }, // F is in a last game slot
        // Round 2
        { id: 'R2G1', round: 2, teams: ['F', 'G'] }, // Conflict for F
        { id: 'R2G2', round: 2, teams: ['D', 'H'] }, // Conflict for D
        { id: 'R2G3', round: 2, teams: ['J', 'K'] }, // Swap for F vs G
        { id: 'R2G4', round: 2, teams: ['L', 'M'] }, // Swap for D vs H
      ];
      args.tourneySchedule.schedule = tourneyGames;
      args.tourneySchedule.games = tourneyGames.length;
      args.areas = 2; // Max 2 games per time slot

      const result = multiAreaSchedule(args as MultipleOptions);
      // Expected:
      // R1: [R1G1, R1G2], [R1G3]
      //     Last games teams: D (from R1G2), F (from R1G3)
      // R2: Attempt to schedule R2G1 (F,G) - conflict F. Swap with R2G3 (J,K) -> R2G3 is now first in R2.
      //     Current R2 schedule: R2G3 (J,K)
      //     Attempt to schedule R2G2 (D,H) - conflict D. Swap with R2G4 (L,M) -> R2G4 is now second in R2.
      //     Current R2 schedule: R2G3 (J,K), R2G4 (L,M)
      //     Then schedule R2G1 (F,G), R2G2 (D,H)
      // Block 1 (R1): [R1G1, R1G2]
      // Block 2 (R1): [R1G3]
      // Block 3 (R2): [R2G3, R2G4] (J-K, L-M)
      // Block 4 (R2): [R2G1, R2G2] (F-G, D-H)
      expect(result[0].map(g=>g.id)).to.deep.equal(['R1G1', 'R1G2']);
      expect(result[1].map(g=>g.id)).to.deep.equal(['R1G3']);

      const r2Block1Teams = result[2].flatMap(g => g.teams);
      expect(r2Block1Teams).to.not.include('F');
      expect(r2Block1Teams).to.not.include('D');
      expect(result[2].map(g => g.id)).to.contain.members(['R2G3', 'R2G4']);

      const r2Block2Teams = result[3].flatMap(g => g.teams);
      expect(r2Block2Teams).to.include.members(['F', 'G', 'D', 'H']);
      expect(result[3].map(g => g.id)).to.contain.members(['R2G1', 'R2G2']);
    });
  });
});
