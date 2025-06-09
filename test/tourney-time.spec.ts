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
      // tourneyTime expects an object with a teams property.
      expect(() =>
        tourneyTime({ teams: 0 } as TestTourneyTimeOptions),
      ).to.throw('You must have at least two teams to continue');
    });
  });

  describe('with one playing area, 20 min games, and 5 minutes rest', () => {
    const defaultTourney: Partial<TestTourneyTimeOptions> = {
      areas: 1,
      gameTime: 20, // gameTime
      restTime: 5, // restTime
      playoffTime: 20, // Assuming playoff times match game times if not specified
      playoffRestTime: 5, // Assuming playoff rests match game rests if not specified
    };

    describe('given two teams', () => {
      it('generates correct output', () => {
        const options: TestTourneyTimeOptions = { ...defaultTourney, teams: 2 };
        const result: TourneyTimeResult = tourneyTime(options);

        // Tourney: roundRobin(2) = 1 item. Playoff: duel(2) = 1 item. Total = 2 items.
        // EffRounds = ceil(1/1) + ceil(1/1) = 1+1 = 2.
        // Time = 2 * (20+5) = 50.
        expect(result.timeNeededMinutes).to.eql(50);
        // For 1 area, schedule should be Game[]
        // scheduleGenerator concatenates tourneySchedule.schedule and playoffSchedule.schedule
        expect(result.schedule.length).to.eql(2); // 1 tourney + 1 playoff
        expect(result.tourneySchedule).to.eql({
          games: 1,
          type: 'round robin',
          areas: 1,
        });
        expect(result.playoffSchedule).to.eql({
          games: 1,
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

      it('generates 1400 minutes needed', () => {
        // Tourney: selector(10,1) -> pods(10) -> 40 items.
        // Playoff: duel(10) -> 16 items.
        // EffRounds = ceil(40/1) + ceil(16/1) = 40+16 = 56.
        // Time = 56 * (20+5) = 1400.
        expect(result.timeNeededMinutes).to.eq(1400);
      });

      it('generates the correct type of tourney schedule', () => {
        expect(result.tourneySchedule).to.eql({
          games: 40,
          type: 'pods',
          areas: 1,
        });
      });

      it('generates a 16 game playoff schedule', () => {
        expect(result.playoffSchedule).to.eql({
          games: 16,
          type: 'knockout'
        });
      });

      it('generates a schedule containing 56 games', () => {
        expect(result.schedule.length).to.eq(56); // 40 tourney + 16 playoff
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
        // Tourney: RR(2)=1 item. selector(2,2) -> areas=1.
        // Playoff: duel(2)=1 item.
        // EffRounds (areas=1): ceil(1/1)+ceil(1/1) = 1+1=2.
        // Time = 2 * (30+10) = 80.
        expect(result.timeNeededMinutes).to.eql(80);
        // For areas=1 (adjusted by selector), schedule is Game[]
        expect(result.schedule.length).to.eql(2);
        expect(result.tourneySchedule).to.eql({
          areas: 1,
          games: 1,
          type: 'round robin',
        });
        expect(result.playoffSchedule).to.eql({
          games: 1,
          type: 'knockout',
        });
      });
    });

    describe('given three teams', () => {
      it('generates correct output', () => {
        const options: TestTourneyTimeOptions = { ...defaultTourney, teams: 3 };
        const result: TourneyTimeResult = tourneyTime(options);
        // Tourney: selector(3,2) -> RR(3)=6 items, areas=1.
        // Playoff: duel(3)=3 items.
        // EffRounds (areas=1): ceil(6/1)+ceil(3/1) = 6+3=9.
        // Time = 9 * (30+10) = 360.
        expect(result.timeNeededMinutes).to.eql(360);
        // For areas=1, schedule is Game[]
        expect(result.schedule.length).to.eql(9); // 6 tourney + 3 playoff

        const expectedScheduleGames: Game[] = [
            { id: 'g0-0', round: 1, teams: [3, 2] as any },
            { id: 'b0-3', round: 1, teams: [1], isByeMatch: true },
            { id: 'g1-0', round: 2, teams: [1, 3] as any },
            { id: 'b1-4', round: 2, teams: [2], isByeMatch: true },
            { id: 'g2-0', round: 3, teams: [2, 1] as any },
            { id: 'b2-5', round: 3, teams: [3], isByeMatch: true },
            { id: 211, round: 1, teams: ['Seed 1'], isByeMatch: true },
            { id: 212, round: 1, teams: ['Seed 3', 'Seed 2'] },
            { id: 221, round: 2, teams: ['Seed 1', 'Winner WB 212'] } // THIS IS THE CRUCIAL FIX
        ];
        // Check that all expected games are present. Order might vary slightly due to concat.
        // Using to.have.deep.members for order-insensitivity if scheduleGenerator output order is not guaranteed.
        // If scheduleGenerator simply concats, then the order should be predictable.
        // For now, ensuring all members are there is a good step.
        expect(result.schedule).to.have.deep.members(expectedScheduleGames);

        expect(result.tourneySchedule).to.eql({
          areas: 1,
          games: 6,
          type: 'round robin',
        });
        expect(result.playoffSchedule).to.eql({
          games: 3,
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
          games: 4, // duel(4) = 4 items (no byes)
          type: 'knockout'
        });
      });

      it('generates 200 minutes needed', () => {
        // Tourney: selector(4,2) -> RR(4)=6 items, areas=2.
        // Playoff: duel(4)=4 items.
        // EffRounds T: ceil(6/2)=3. EffRounds P: ceil(4/2)=2. Total=5.
        // Time = 5 * (30+10) = 200.
        expect(result.timeNeededMinutes).to.eq(200);
      });

      it('generates the 6 game tourney schedule', () => {
        expect(result.tourneySchedule).to.eql({
          games: 6,
          type: 'round robin',
          areas: 2,
        });
      });

      it('generates a schedule containing 5 effective rounds', () => {
        // schedule is Game[][] for areas > 1
        expect(result.schedule.length).to.eq(5); // 3 tourney rounds + 2 playoff rounds
      });
    });

    describe('given ten teams', () => {
      let result: TourneyTimeResult;

      beforeEach(() => {
        const options: TestTourneyTimeOptions = { ...defaultTourney, teams: 10 };
        result = tourneyTime(options);
      });

      it('generates a 16 game playoff schedule', () => {
        expect(result.playoffSchedule).to.eql({
          games: 16, // duel(10) new
          type: 'knockout'
        });
      });

      it('generates 1120 minutes needed', () => {
        // Tourney: selector(10,2) -> pods(10)=40 items. Areas=2.
        // Playoff: duel(10)=16 items.
        // EffRounds T: ceil(40/2)=20. EffRounds P: ceil(16/2)=8. Total=28.
        // Time = 28 * (30+10) = 1120.
        expect(result.timeNeededMinutes).to.eq(1120);
      });

      it('generates a 40 game tourney schedule', () => {
        expect(result.tourneySchedule).to.eql({
          games: 40,
          type: 'pods',
          areas: 2,
        });
      });

      it('generates a schedule containing 28 effective rounds', () => {
        // EffRounds = 20 + 8 = 28
        expect(result.schedule.length).to.eq(28);
      });
    });
  });
});
