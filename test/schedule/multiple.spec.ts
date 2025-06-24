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
// const threeGameResults: Game[][] = [ // Unused
//   [{ id: 10, round: 1, teams: [3, 2] as any }],
//   [{ id: 20, round: 2, teams: [1, 3] as any }],
//   [{ id: 30, round: 3, teams: [2, 1] as any }],
// ];
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
// const fourGameResults: Game[][] = [ // Unused
//   [
//     { id: 211, round: 1, teams: ['Seed 1', 'Seed 4'] },
//     { id: 212, round: 1, teams: ['Seed 3', 'Seed 2'] },
//   ],
//   [
//     { id: 221, round: 2, teams: ['Loser 211', 'Loser 212'] },
//     { id: 222, round: 2, teams: ['Winner 211', 'Winner 212'] },
//   ],
// ];
// const sixGameResults: Game[][] = [ // Unused
//   [
//     { teams: [4, 1] as any, round: 1, id: 10 },
//     { teams: [3, 2] as any, round: 1, id: 11 },
//   ],
//   [
//     { teams: [1, 3] as any, round: 2, id: 20 },
//     { teams: [4, 2] as any, round: 2, id: 21 },
//   ],
//   [
//     { teams: [2, 1] as any, round: 3, id: 30 },
//     { teams: [4, 3] as any, round: 3, id: 31 },
//   ],
// ];

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
        // scheduleBalancer clones games. Expect cloned game.
        const expected = [[{ ...singleGameSchedule[0] }]];
        expect(multiAreaSchedule(args as MultipleOptions)).to.deep.equal(expected);
      });

      describe('and a one game playoff schedule', () => {
        let playoffClone: Game[];
        beforeEach(() => {
          // Make a distinct game object for playoff if its content is the same
          playoffClone = [{ ...singleGameSchedule[0], id: singleGameSchedule[0].id + '_playoff' }];
          args.playoffSchedule.schedule = playoffClone;
          args.playoffSchedule.games = 1;
        });

        it('returns two games in two rounds', () => {
          const result = multiAreaSchedule(args as MultipleOptions);
          // Block 1: [game from tourney]
          // Block 2: [game from playoff] - this game is b2b with game from tourney
          expect(result.length).to.equal(2);
          expect(result[0].length).to.equal(1);
          expect(result[1].length).to.equal(1);
          expect(result[0][0]).to.deep.include({ ...singleGameSchedule[0] });
          expect(result[0][0].backToBackTeams).to.be.undefined;
          expect(result[1][0]).to.deep.include({ ...playoffClone[0] });
          expect(result[1][0].backToBackTeams).to.deep.equal(playoffClone[0].teams);
        });
      });
    });

    describe('given a three game tournament schedule', () => {
      // threeGameSchedule:
      // { id: 10, round: 1, teams: [3, 2] },
      // { id: 20, round: 2, teams: [1, 3] },
      // { id: 30, round: 3, teams: [2, 1] },
      // threeGameResults: (expected structure from scheduleBalancer before annotation)
      // [[{ id: 10, r:1, t:[3,2] }]],
      // [[{ id: 20, r:2, t:[1,3] }]],
      // [[{ id: 30, r:3, t:[2,1] }]],
      beforeEach(() => {
        args.tourneySchedule.schedule = threeGameSchedule; // This is Game[]
        args.tourneySchedule.games = 3;
        args.playoffSchedule.schedule = [];
        args.playoffSchedule.games = 0;
      });

      it('returns three rounds of games, as a team cannot play twice in the same round, annotated', () => {
        const result = multiAreaSchedule(args as MultipleOptions);
        expect(result.length).to.equal(3);
        expect(result[0][0]).to.deep.include({ ...threeGameSchedule[0] });
        expect(result[0][0].backToBackTeams).to.be.undefined;

        expect(result[1][0]).to.deep.include({ ...threeGameSchedule[1] });
        expect(result[1][0].backToBackTeams).to.deep.equal([3]); // Team 3 from game 0

        expect(result[2][0]).to.deep.include({ ...threeGameSchedule[2] });
        expect(result[2][0].backToBackTeams).to.deep.equal([1]); // Team 1 from game 1
      });

      describe('and a two game playoff schedule, where the same teams play in the same round', () => {
        let playoffGamesInput: Game[];
        beforeEach(() => {
          args.playoffSchedule.schedule = [
            { id: 40, round: 1, teams: [3, 2] as any },
            { id: 50, round: 1, teams: [1, 3] as any },
          ];
          playoffGamesInput = [ // Capture for use in assertions
            { id: 40, round: 1, teams: [3, 2] as any },
            { id: 50, round: 1, teams: [1, 3] as any },
          ];
          args.playoffSchedule.schedule = playoffGamesInput;
          args.playoffSchedule.games = 2;
        });

        it('returns five games in five rounds, annotated', () => {
          const result = multiAreaSchedule(args as MultipleOptions);
          expect(result.length).to.equal(5);
          // Tourney part (first 3 blocks)
          expect(result[0][0].backToBackTeams).to.be.undefined;
          expect(result[1][0].backToBackTeams).to.deep.equal([3]); // Team 3 from block 0
          expect(result[2][0].backToBackTeams).to.deep.equal([1]); // Team 1 from block 1
          // Playoff part (next 2 blocks)
          // Game {id: 40, t:[3,2]} is b2b with game {id:30, t:[2,1]} from block 2 (Team 2)
          // Game {id: 50, t:[1,3]} is b2b with game {id:40, t:[3,2]} from block 3 (Team 3)
          expect(result[3][0]).to.deep.include({ ...playoffGamesInput[0] });
          expect(result[3][0].backToBackTeams).to.deep.equal([2]);
          expect(result[4][0]).to.deep.include({ ...playoffGamesInput[1] });
          expect(result[4][0].backToBackTeams).to.deep.equal([3]);
        });
      });

      describe('and a two game playoff schedule, where the different teams play in the different rounds', () => {
        let playoffGamesInput: Game[];
        beforeEach(() => {
          playoffGamesInput = [
            { id: 40, round: 1, teams: [3, 2] as any }, // Different round from tourney games for simplicity in old tests
            { id: 50, round: 2, teams: [4, 1] as any }, // Different round
          ];
          args.playoffSchedule.schedule = playoffGamesInput;
          args.playoffSchedule.games = 2;
        });

        it('returns five games in five rounds, annotated', () => {
          const result = multiAreaSchedule(args as MultipleOptions);
          expect(result.length).to.equal(5);
           // Tourney part (first 3 blocks)
          expect(result[0][0].backToBackTeams).to.be.undefined;
          expect(result[1][0].backToBackTeams).to.deep.equal([3]);
          expect(result[2][0].backToBackTeams).to.deep.equal([1]);
          // Playoff part
          // Game {id: 40, t:[3,2]} is b2b with game {id:30, t:[2,1]} (Team 2)
          // Game {id: 50, t:[4,1]} is b2b with game {id:40, t:[3,2]} (no common teams - this was an error in manual trace)
          // Let's re-evaluate: prev block game is {id:40, t:[3,2]}. Current game {id:50, t:[4,1]}. No common teams.
          expect(result[3][0]).to.deep.include({ ...playoffGamesInput[0] });
          expect(result[3][0].backToBackTeams).to.deep.equal([2]);
          expect(result[4][0]).to.deep.include({ ...playoffGamesInput[1] });
          expect(result[4][0].backToBackTeams).to.be.undefined; // No common teams with [3,2]
        });
      });
    });

    describe('given a six game tournament schedule', () => {
      // sixGameSchedule is Game[]
      // sixGameResults is Game[][] - this is the expected output from scheduleBalancer *before* annotation
      // Block 0: [{ teams: [4, 1], r:1,id:10 }, { teams: [3, 2], r:1,id:11 }]
      // Block 1: [{ teams: [1, 3], r:2,id:20 }, { teams: [4, 2], r:2,id:21 }]
      // Block 2: [{ teams: [2, 1], r:3,id:30 }, { teams: [4, 3], r:3,id:31 }]
      beforeEach(() => {
        args.tourneySchedule.schedule = sixGameSchedule;
        args.tourneySchedule.games = 6;
        args.playoffSchedule.schedule = [];
        args.playoffSchedule.games = 0;
      });

      it('returns three rounds of games, annotated', () => {
        const result = multiAreaSchedule(args as MultipleOptions);
        expect(result.length).to.equal(3); // 3 blocks
        // Block 0: No annotations
        result[0].forEach(game => expect(game.backToBackTeams).to.be.undefined);

        // Block 1:
        // Game id:20 {t:[1,3]} - Team 1 b2b with id:10 {t:[4,1]}. Team 3 b2b with id:11 {t:[3,2]}
        expect(result[1].find(g=>g.id===20)!.backToBackTeams).to.deep.members([1,3]);
        // Game id:21 {t:[4,2]} - Team 4 b2b with id:10 {t:[4,1]}. Team 2 b2b with id:11 {t:[3,2]}
        expect(result[1].find(g=>g.id===21)!.backToBackTeams).to.deep.members([4,2]);

        // Block 2:
        // Game id:30 {t:[2,1]} - Team 2 b2b with id:21 {t:[4,2]}. Team 1 b2b with id:20 {t:[1,3]}
        expect(result[2].find(g=>g.id===30)!.backToBackTeams).to.deep.members([1,2]);
        // Game id:31 {t:[4,3]} - Team 4 b2b with id:21 {t:[4,2]}. Team 3 b2b with id:20 {t:[1,3]}
        expect(result[2].find(g=>g.id===31)!.backToBackTeams).to.deep.members([3,4]);
      });

      describe('and a four game playoff schedule', () => {
        // fourGamePlayoff is Game[]
        // fourGameResults is Game[][] - expected from scheduleBalancer for playoff part
        // Block P0: [{id:211, r:1, t:['S1','S4']}, {id:212, r:1, t:['S3','S2']}]
        // Block P1: [{id:221, r:2, t:['L211','L212']}, {id:222, r:2, t:['W211','W212']}]
        beforeEach(() => {
          args.playoffSchedule.schedule = fourGamePlayoff;
          args.playoffSchedule.games = 4;
        });

        it('returns five rounds total, annotated', () => {
          const result = multiAreaSchedule(args as MultipleOptions);
          expect(result.length).to.equal(5); // 3 from tourney + 2 from playoff

          // Tourney annotations (already checked above, ensure they are still there)
          expect(result[1].find(g=>g.id===20)!.backToBackTeams).to.deep.members([1,3]);
          expect(result[1].find(g=>g.id===21)!.backToBackTeams).to.deep.members([4,2]);
          expect(result[2].find(g=>g.id===30)!.backToBackTeams).to.deep.members([1,2]);
          expect(result[2].find(g=>g.id===31)!.backToBackTeams).to.deep.members([3,4]);

          // Playoff annotations (Blocks 3 and 4 of combined schedule)
          // Block 3 (was P0): Games id:211, id:212
          // Teams from Block 2 (tourney): [2,1] from id:30 and [4,3] from id:31. So, [1,2,3,4]
          // Game id:211 {t:['S1','S4']} - S1/S4 not in [1,2,3,4] (assuming string comparison)
          // Game id:212 {t:['S3','S2']} - S3/S2 not in [1,2,3,4]
          // So, no annotations for Block 3 if team names are distinct strings.
          // The original test data uses strings like 'Seed 1'.
          // The previous tourney games used numbers. They won't match.
          result[3].forEach(game => expect(game.backToBackTeams).to.be.undefined);

          // Block 4 (was P1): Games id:221, id:222
          // Teams from Block 3 (playoff): ['S1','S4'] from id:211 and ['S3','S2'] from id:212. So, [S1,S2,S3,S4]
          // Game id:221 {t:['L211','L212']} - These are placeholder names, not actual teams from previous block.
          // Game id:222 {t:['W211','W212']} - Same here.
          // Therefore, they should not be marked as back-to-back based on team name identity.
          const game221 = result[4].find(g=>g.id===221);
          const game222 = result[4].find(g=>g.id===222);
          expect(game221, "Game 221 should exist").to.exist;
          expect(game222, "Game 222 should exist").to.exist;
          expect(game221!.backToBackTeams).to.be.undefined;
          expect(game222!.backToBackTeams).to.be.undefined;
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

  describe('back-to-back game annotation in multi-area schedules', () => {
    beforeEach(() => {
      // Default to 2 areas for these tests, can be overridden
      args.areas = 2;
    });

    it('should not annotate if no games are back-to-back across blocks', () => {
      const tourneyGames: Game[] = [ // These will be processed by scheduleBalancer
        { id: 'R1G1', round: 1, teams: ['A', 'B'] }, { id: 'R1G2', round: 1, teams: ['C', 'D'] },
        { id: 'R2G1', round: 2, teams: ['E', 'F'] }, { id: 'R2G2', round: 2, teams: ['G', 'H'] },
      ];
      args.tourneySchedule.schedule = tourneyGames;
      args.playoffSchedule.schedule = [];

      // Expected structure after scheduleBalancer (approx, depends on exact balancer logic for rounds vs blocks)
      // For simplicity, assume balancer output is:
      // Block 1: [R1G1, R1G2]
      // Block 2: [R2G1, R2G2]
      const result = multiAreaSchedule(args as MultipleOptions);

      result.forEach(block => {
        block.forEach(game => {
          expect(game.backToBackTeams).to.be.undefined;
        });
      });
    });

    it('should annotate a simple back-to-back game across blocks', () => {
      const tourneyGames: Game[] = [
        { id: 'R1G1', round: 1, teams: ['A', 'B'] }, { id: 'R1G2', round: 1, teams: ['C', 'D'] },
        { id: 'R2G1', round: 2, teams: ['A', 'E'] }, // A plays b2b from R1G1
      ];
      args.tourneySchedule.schedule = tourneyGames;
      args.playoffSchedule.schedule = [];
      const result = multiAreaSchedule(args as MultipleOptions);

      // Resulting structure from multiAreaSchedule will be Game[][]
      // Example: result = [ [{id:R1G1}, {id:R1G2}], [{id:R2G1, backToBackTeams:['A']}] ]
      // Need to find R2G1 in the result to check its annotation.
      let gameR2G1: Game | undefined;
      result.forEach(block => block.forEach(game => {
        if (game.id === 'R2G1') gameR2G1 = game;
      }));

      expect(gameR2G1).to.exist;
      expect(gameR2G1!.backToBackTeams).to.deep.equal(['A']);

      // Check that other games are not annotated
      result.forEach(block => block.forEach(game => {
        if (game.id === 'R1G1' || game.id === 'R1G2') {
          expect(game.backToBackTeams).to.be.undefined;
        }
      }));
    });

    it('should annotate multiple back-to-back games across blocks', () => {
      const tourneyGames: Game[] = [
        { id: 'R1G1', round: 1, teams: ['A', 'B'] }, { id: 'R1G2', round: 1, teams: ['C', 'D'] },
        { id: 'R2G1', round: 2, teams: ['A', 'E'] }, // A is b2b
        { id: 'R2G2', round: 2, teams: ['D', 'F'] }, // D is b2b
        { id: 'R3G1', round: 3, teams: ['E', 'G'] }, // E is b2b
        { id: 'R3G2', round: 3, teams: ['B', 'H'] }, // B is not b2b with R1G1
      ];
      args.tourneySchedule.schedule = tourneyGames;
      args.playoffSchedule.schedule = [];
      const result = multiAreaSchedule(args as MultipleOptions);

      const findGame = (id: string) => {
        for (const block of result) {
          for (const game of block) {
            if (game.id === id) return game;
          }
        }
        return undefined;
      };

      expect(findGame('R1G1')!.backToBackTeams).to.be.undefined;
      expect(findGame('R1G2')!.backToBackTeams).to.be.undefined;
      expect(findGame('R2G1')!.backToBackTeams).to.deep.equal(['A']);
      expect(findGame('R2G2')!.backToBackTeams).to.deep.equal(['D']);
      expect(findGame('R3G1')!.backToBackTeams).to.deep.equal(['E']);
      expect(findGame('R3G2')!.backToBackTeams).to.be.undefined; // B played in R1, this is R3
    });

    it('should handle empty schedule for annotation', () => {
      args.tourneySchedule.schedule = [];
      args.playoffSchedule.schedule = [];
      const result = multiAreaSchedule(args as MultipleOptions);
      expect(result).to.eql([]);
    });

    it('should handle schedule with one block for annotation', () => {
      const tourneyGames: Game[] = [
        { id: 'R1G1', round: 1, teams: ['A', 'B'] }, { id: 'R1G2', round: 1, teams: ['C', 'D'] },
      ];
      args.tourneySchedule.schedule = tourneyGames;
      args.playoffSchedule.schedule = [];
      const result = multiAreaSchedule(args as MultipleOptions);

      expect(result.length).to.be.greaterThan(0); // Should be at least one block
      result.forEach(block => {
        block.forEach(game => {
          expect(game.backToBackTeams).to.be.undefined;
        });
      });
    });

    it('should correctly annotate when games come from both tourney and playoff schedules', () => {
      // Balancer will put these into blocks.
      // Tourney: R1: [G1, G2]
      // Playoff: R1: [G3, G4], R2: [G5]
      // Combined: Block1=[G1,G2], Block2=[G3,G4], Block3=[G5] (approx)
      args.tourneySchedule.schedule = [
        { id: 'G1', round: 1, teams: ['A', 'B'] },
        { id: 'G2', round: 1, teams: ['C', 'D'] },
      ];
      args.playoffSchedule.schedule = [
        { id: 'G3', round: 1, teams: ['A', 'E'] }, // A is b2b with G1 (A,B) from previous block (tourney)
        { id: 'G4', round: 1, teams: ['F', 'G'] },
        { id: 'G5', round: 2, teams: ['E', 'H'] }, // E is b2b with G3 (A,E) from previous block (playoff R1)
      ];
      args.areas = 2; // Ensure areas is set
      const result = multiAreaSchedule(args as MultipleOptions);

      const findGame = (id: string) => {
        for (const block of result) {
          for (const game of block) {
            if (game.id === id) return game;
          }
        }
        return undefined;
      };

      // Note: Exact block structure depends on scheduleBalancer.
      // We are testing the annotation *after* balancing and concatenation.
      // Assuming G1,G2 are in block(s) before G3,G4, which are before G5.

      const gameG1 = findGame('G1');
      const gameG3 = findGame('G3');
      const gameG5 = findGame('G5');

      expect(gameG1, "G1 should exist").to.exist;
      expect(gameG3, "G3 should exist").to.exist;
      expect(gameG5, "G5 should exist").to.exist;

      expect(gameG1!.backToBackTeams, "G1 b2b").to.be.undefined;
      // Check G3 based on teams in the block *before* G3's block
      // This requires knowing the block structure.
      // The test should verify that if G1 is in block N, and G3 is in block N+1, G3 gets annotated.
      // The current findGame doesn't give block context easily for this check.
      // However, the logic in multiple.ts iterates blocks sequentially.

      // A simpler check:
      // If G3 involves 'A' and 'A' was in any game of the previous block, G3.b2b should include 'A'.
      // If G5 involves 'E' and 'E' was in any game of the previous block, G5.b2b should include 'E'.

      // This test might be more robust if we construct the Game[][] manually to represent
      // the state *before* the final annotation loop in multiple.ts, then pass that to a
      // helper if we extract the annotation loop, or check properties on the result.
      // For now, relying on the full function:
      expect(gameG3!.backToBackTeams, "G3 b2b").to.deep.include('A');
      expect(gameG5!.backToBackTeams, "G5 b2b").to.deep.include('E');
    });
  });
});
