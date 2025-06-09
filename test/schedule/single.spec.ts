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
});
