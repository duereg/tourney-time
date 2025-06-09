import { expect } from './spec-helper'; // Adjusted path for spec-helper
import tourneyTime from '@lib/tourney-time'; // Using path alias for the main module
import {
  Game,
  Schedule as TourneyScheduleType,
  TourneyTimeOptions,
} from '@lib/tourney-time'; // Assuming types

interface TestTourneyTimeOptions extends Partial<TourneyTimeOptions> {
  teams: number; // teams is always required for these tests
  time?: number; // Alias for gameTime
  rest?: number; // Alias for restTime
  // playoffTime and playoffRestTime are direct matches
}

interface TourneyTimeResult {
  timeNeededMinutes: number;
  schedule: (Game[] | Game)[]; // Schedule can be Game[] or Game[][] based on areas
  tourneySchedule: TourneyScheduleType & { areas?: number }; // areas is part of tourneySchedule in results
  playoffSchedule: TourneyScheduleType;
}

describe('tourney-time', () => {
  describe('given one team', () => {
    it('throws an error', () => {
      expect(() =>
        tourneyTime({ teams: 0 } as TestTourneyTimeOptions),
      ).to.throw('You must have at least two teams to continue');
    });
  });

  describe('with one playing area, 20 min games, and 5 minutes rest', () => {
    const defaultTourney: Partial<TestTourneyTimeOptions> = {
      areas: 1,
      gameTime: 20,
      restTime: 5,
      playoffTime: 20,
      playoffRestTime: 5,
    };

    describe('given two teams', () => {
      it('generates correct output', () => {
        const options: TestTourneyTimeOptions = { ...defaultTourney, teams: 2 };
        const result: TourneyTimeResult = tourneyTime(options);
        // Actual games: RR(2)=1, Duel(2)=1. Total actual=2.
        // Schedule items: RR(2)=1, Duel(2)=1. Total items=2.
        // Time (A=1): (ceil(1/1)+ceil(1/1))*(20+5) = (1+1)*25 = 50.
        expect(result.timeNeededMinutes).to.eql(50);
        expect(result.schedule.length).to.eql(2); // Total items
        expect(result.tourneySchedule).to.eql({
          games: 1, // Actual games
          type: 'round robin',
          areas: 1,
        });
        expect(result.playoffSchedule).to.eql({
          games: 1, // Actual games
          type: 'knockout',
        });
      });
    });

    describe('given ten teams, with all options', () => {
      let result: TourneyTimeResult;

      beforeEach(() => {
        const options: TestTourneyTimeOptions = { ...defaultTourney, teams: 10 };
        result = tourneyTime(options);
      });

      it('generates 925 minutes needed', () => {
        // Actual Tourney Games (pods(10)): 27. Schedule items: 33.
        // Actual Playoff Games (duel(10)): 10. Schedule items: 16.
        // Areas = 1.
        // Time (A=1): (ceil(27/1)+ceil(10/1))*(20+5) = (27+10)*25 = 37*25 = 925.
        expect(result.timeNeededMinutes).to.eq(925);
      });

      it('generates the correct type of tourney schedule', () => {
        expect(result.tourneySchedule).to.eql({
          games: 27, // Actual games from pods(10)
          type: 'pods',
          areas: 1,
        });
      });

      it('generates a 10 game playoff schedule', () => {
        expect(result.playoffSchedule).to.eql({
          games: 10, // Actual games from duel(10)
          type: 'knockout'
        });
      });

      it('generates a schedule containing 49 games/byes', () => {
        // Total items: pods(10) schedule items = 33, duel(10) schedule items = 16. Sum = 49.
        expect(result.schedule.length).to.eq(49);
      });
    });
  });

  describe('with two playing areas, 30 min games, and 10 min rest', () => {
    const defaultTourney: Partial<TestTourneyTimeOptions> = {
      areas: 2,
      gameTime: 30,
      restTime: 10,
      playoffTime: 30,
      playoffRestTime: 10,
    };

    describe('given two teams', () => {
      it('generates correct output', () => {
        const options: TestTourneyTimeOptions = { ...defaultTourney, teams: 2 };
        const result: TourneyTimeResult = tourneyTime(options);
        // Actual games: RR(2)=1, Duel(2)=1. Areas (adjusted by selector for RR(2)) = 1.
        // Time (A=1): (ceil(1/1)+ceil(1/1))*(30+10) = (1+1)*40 = 80.
        expect(result.timeNeededMinutes).to.eql(80);
        expect(result.schedule.length).to.eql(2); // Total items
        expect(result.tourneySchedule).to.eql({
          areas: 1,
          games: 1, // Actual games
          type: 'round robin',
        });
        expect(result.playoffSchedule).to.eql({
          games: 1, // Actual games
          type: 'knockout',
        });
      });
    });

    describe('given three teams', () => {
      it('generates correct output', () => {
        const options: TestTourneyTimeOptions = { ...defaultTourney, teams: 3 };
        const result: TourneyTimeResult = tourneyTime(options);
        // Actual games: RR(3)=3, Duel(3)=2. Areas (adjusted by selector for RR(3)) = 1.
        // Time (A=1): (ceil(3/1)+ceil(2/1))*(30+10) = (3+2)*40 = 200.
        expect(result.timeNeededMinutes).to.eql(200);
        // Schedule items: RR(3)=6, Duel(3)=3. Total items = 9.
        expect(result.schedule.length).to.eql(9);

        const expectedScheduleGames: Game[] = [
            { id: 'g0-0', round: 1, teams: [3, 2] as any },
            { id: 'b0-3', round: 1, teams: [1], isByeMatch: true },
            { id: 'g1-0', round: 2, teams: [1, 3] as any },
            { id: 'b1-4', round: 2, teams: [2], isByeMatch: true },
            { id: 'g2-0', round: 3, teams: [2, 1] as any },
            { id: 'b2-5', round: 3, teams: [3], isByeMatch: true },
            { id: 211, round: 1, teams: ['Seed 1'], isByeMatch: true },
            { id: 212, round: 1, teams: ['Seed 3', 'Seed 2'] },
            { id: 221, round: 2, teams: ['Seed 1', 'Winner WB 212'] }
        ];
        expect(result.schedule).to.have.deep.members(expectedScheduleGames);

        expect(result.tourneySchedule).to.eql({
          areas: 1,
          games: 3, // Actual games from RR(3)
          type: 'round robin',
        });
        expect(result.playoffSchedule).to.eql({
          games: 2, // Actual games from duel(3)
          type: 'knockout',
        });
      });
    });

    describe('given four teams', () => {
      let result: TourneyTimeResult;

      beforeEach(() => {
        const options: TestTourneyTimeOptions = { ...defaultTourney, teams: 4 };
        result = tourneyTime(options);
      });

      it('generates a 4 game playoff schedule', () => {
        expect(result.playoffSchedule).to.eql({
          games: 4, // Actual games from duel(4)
          type: 'knockout'
        });
      });

      it('generates 200 minutes needed', () => {
        // Actual games: RR(4)=6, Duel(4)=4. Areas (selector for RR(4), areas=2) = 2.
        // Time (A=2): (ceil(6/2)+ceil(4/2))*(30+10) = (3+2)*40 = 200.
        expect(result.timeNeededMinutes).to.eq(200);
      });

      it('generates the 6 game tourney schedule', () => {
        expect(result.tourneySchedule).to.eql({
          games: 6, // Actual games from RR(4)
          type: 'round robin',
          areas: 2,
        });
      });

      it('generates a schedule containing 5 effective rounds', () => {
        // Schedule items: RR(4)=6, Duel(4)=4.
        // EffRounds (A=2): ceil(6/2) + ceil(4/2) = 3+2=5.
        expect(result.schedule.length).to.eq(5);
      });
    });

    describe('given ten teams', () => {
      let result: TourneyTimeResult;

      beforeEach(() => {
        const options: TestTourneyTimeOptions = { ...defaultTourney, teams: 10 };
        result = tourneyTime(options);
      });

      it('generates a 10 game playoff schedule', () => {
        expect(result.playoffSchedule).to.eql({
          games: 10, // Actual games from duel(10)
          type: 'knockout'
        });
      });

      it('generates 760 minutes needed', () => {
        // Actual games: pods(10)=27, duel(10)=10. Areas (selector for pods(10), areas=2) = 2.
        // Time (A=2): (ceil(27/2)+ceil(10/2))*(30+10) = (14+5)*40 = 19*40 = 760.
        expect(result.timeNeededMinutes).to.eq(760);
      });

      it('generates a 27 game tourney schedule', () => {
        expect(result.tourneySchedule).to.eql({
          games: 27, // Actual games from pods(10)
          type: 'pods',
          areas: 2,
        });
      });

      it('generates a schedule containing 25 effective rounds', () => {
        // Schedule items: pods(10)=33, duel(10)=16.
        // EffRounds (A=2): ceil(33/2) + ceil(16/2) = 17+8=25.
        expect(result.schedule.length).to.eq(25);
      });
    });
  });
});
