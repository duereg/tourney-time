import { expect } from '../spec-helper';
import multiAreaSchedule from '@lib/schedule/multiple'; // Using path alias
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
        "Cannot read property 'tourneySchedule' of undefined",
      );
    });

    it('given a tourneySchedule param set to null, throws', () => {
      expect(() =>
        multiAreaSchedule({
          tourneySchedule: null as any,
          playoffSchedule,
          areas,
        }),
      ).to.throw('You must provide a tournament schedule to continue');
    });

    it('given a playoffSchedule param set to null, throws', () => {
      expect(() =>
        multiAreaSchedule({
          tourneySchedule,
          playoffSchedule: null as any,
          areas,
        }),
      ).to.throw('You must provide a playoff schedule to continue');
    });

    it('given no games to schedule returns []', () => {
      // Ensure schedules are empty for this case
      args.tourneySchedule.schedule = [];
      args.playoffSchedule.schedule = [];
      expect(multiAreaSchedule(args)).to.eql([]);
    });

    describe('given an empty tournament schedule', () => {
      beforeEach(() => {
        args.tourneySchedule.schedule = [];
        args.tourneySchedule.games = 0; // ensure games count is also 0
      });

      it('returns []', () => {
        expect(multiAreaSchedule(args)).to.eql([]);
      });

      describe('and an empty playoff schedule', () => {
        beforeEach(() => {
          args.playoffSchedule.schedule = [];
          args.playoffSchedule.games = 0; // ensure games count is also 0
        });

        it('returns []', () => {
          expect(multiAreaSchedule(args)).to.eql([]);
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
        expect(multiAreaSchedule(args)).to.eql([singleGameSchedule]);
      });

      describe('and a one game playoff schedule', () => {
        beforeEach(() => {
          args.playoffSchedule.schedule = singleGameSchedule;
          args.playoffSchedule.games = 1;
        });

        it('returns two games in two rounds', () => {
          expect(multiAreaSchedule(args)).to.eql([
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
        const results = multiAreaSchedule(args);
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
          expect(multiAreaSchedule(args)).to.eql(
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
          expect(multiAreaSchedule(args)).to.eql(
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
        const results = multiAreaSchedule(args);
        expect(results).to.eql(sixGameResults);
      });

      describe('and a four game playoff schedule', () => {
        beforeEach(() => {
          args.playoffSchedule.schedule = fourGamePlayoff;
          args.playoffSchedule.games = 4;
        });

        it('returns five rounds total (3 from tourney, 2 from playoff)', () => {
          // Corrected description based on data shapes
          expect(multiAreaSchedule(args)).to.eql(
            sixGameResults.concat(fourGameResults),
          );
        });
      });
    });
  });
});
