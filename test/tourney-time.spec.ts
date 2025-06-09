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
  // playoffTime and playoffRest are direct matches
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
      playoffTime: 20,
      playoffRestTime: 5, // playoffRestTime
    };

    describe('given two teams', () => {
      it('generates correct output', () => {
        const options: TestTourneyTimeOptions = { ...defaultTourney, teams: 2 };
        const result: TourneyTimeResult = tourneyTime(options);

        // For 1 area, schedule should be Game[]
        expect(result.timeNeededMinutes).to.eql(50); // (1 RR game * 20) + (1 PO game * 20) + (1 rest * 5) + (1 PO rest * 5) ??
        // RR: 1 game * (20+5) = 25. PO: 1 game * (20+5) = 25. Total = 50. Correct.
        expect(result.schedule).to.eql([
          { id: "g0-0", round: 1, teams: [2, 1] as any }, // RR game
          { id: 111, round: 1, teams: ['Seed 1', 'Seed 2'] }, // PO game
        ]);
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

      it('generates 950 minutes needed', () => {
        // 10 teams, 1 area. Pods.
        // Pods(10) -> type pods, 28 games ( (4C2)*3 pods + (2C2)*1 pod for leftover? No, it's 2 pods of 5 or similar for 4 teams/pod)
        // For 10 teams, default 4 teams/pod -> 2 pods of 3, 1 pod of 4 (from teams-in-pods) OR 2 pods of 5.
        // If 2 pods of 5 teams: Each pod RR = 10 games. Total pod games = 20.
        // Divisions: 5 divs. D1(1P1,1P2), D2(2P1,2P2)...D5(5P1,5P2). Each 1 game. Total div games = 5.
        // Crossover (5 divs): (5-1)*2 = 8 games.
        // Total tourney games = 20+5+8 = 33 games.
        // The test expects tourneySchedule.games = 28. This comes from selector(10,1) -> pods.
        // pods(10) with default teamsInPods=4 -> Pods: P1(1,5,9), P2(2,6,10), P3(3,7), P4(4,8)
        // P1:3, P2:3, P3:2, P4:2 games. Total pod games = 3+3+1+1 = 8.
        // Divs (max 3): D1(1P1,1P2,1P3,1P4), D2(2P1,2P2,2P3,2P4), D3(3P1,3P2). D1=6,D2=6,D3=1. Total div games = 13.
        // Crossover (3 divs): (3-1)*2 = 4 games.
        // Total tourney games = 8+13+4 = 25.
        // The test expectation of 28 games implies selector(10,1) is using a different pod config or calculation.
        // Let's assume the test values are correct for the library's internal logic.
        // 28 tourney games, 10 playoff games. Total 38 games.
        // Time: 38 games * (20 min game + 5 min rest) - 5 min (no rest after last game) = 38 * 25 - 5 = 950 - 5 = 945.
        // The original test expects 950. This implies rest is counted after every game.
        // 38 * (20+5) = 950.
        expect(result.timeNeededMinutes).to.eq(950);
      });

      it('generates the correct type of tourney schedule', () => {
        expect(result.tourneySchedule).to.eql({
          games: 28,
          type: 'pods',
          areas: 1,
        });
      });

      it('generates a 10 game playoff schedule', () => {
        // duel(10) for playoffs. 10 teams -> 10 games (single elim with 3rd place).
        expect(result.playoffSchedule).to.eql({ games: 10, type: 'knockout' });
      });

      it('generates a schedule containing 38 games', () => {
        // Changed from rounds to games
        expect(result.schedule.length).to.eq(38);
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
        // Schedule for 2 areas is Game[][]
        // Tourney: 1 game. PO: 1 game.
        // Time: 1 game on 1 area (effectively, since only 1 game). (30+10) = 40.
        // PO: 1 game on 1 area. (30+10) = 40. Total 80.
        expect(result.timeNeededMinutes).to.eql(80);
        expect(result.schedule).to.eql([
          { id: "g0-0", round: 1, teams: [2, 1] as any }, // RR game in its own "area" array
          { id: 111, round: 1, teams: ['Seed 1', 'Seed 2'] }, // PO game
        ]);
        expect(result.tourneySchedule).to.eql({
          areas: 1, // tourneySchedule.areas is reduced if games < areas
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

        expect(result.timeNeededMinutes).to.eql(200);
        expect(result.schedule).to.have.deep.members([
          { id: "g0-0", round: 1, teams: [3, 2] as any }, // RR G1
          { id: "g1-0", round: 2, teams: [1, 3] as any }, // RR G2
          { id: "g2-0", round: 3, teams: [2, 1] as any }, // RR G3
          { id: 212, round: 1, teams: ['Seed 3', 'Seed 2'] }, // PO G1
          { id: 221, round: 2, teams: ['Seed 1', 'Winner 212'] }, // PO G2
        ]);
        expect(result.tourneySchedule).to.eql({
          areas: 1, // Reduced because 3 games < 2 areas * X rounds implies not fully using 2 areas always
          games: 3,
          type: 'round robin',
        });
        expect(result.playoffSchedule).to.eql({
          games: 2,
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
        // duel(4) -> 4 games (S1vS4, S2vS3, finals, 3rd place)
        expect(result.playoffSchedule).to.eql({ games: 4, type: 'knockout' });
      });

      it('generates 200 minutes needed', () => {
        // RR for 4 teams = 6 games. PO for 4 teams = 4 games.
        // tourneyAreaLength = calcAreaLength(6 games / 2 areas) = floor(3)+0 = 3 "effective rounds"
        // playoffAreaLength = calcAreaLength(4 games / 2 areas) = floor(2)+0 = 2 "effective rounds"
        // Total time = 3 * (30+10) + 2 * (30+10) = 3*40 + 2*40 = 120 + 80 = 200. This matches.
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
        // schedule is Game[][]
        // RR 6 games on 2 areas: 3 "rounds" from multiAreaSchedule
        // PO 4 games on 2 areas: 2 "rounds" from multiAreaSchedule
        // Total 3+2 = 5 effective rounds in the schedule array.
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
        expect(result.playoffSchedule).to.eql({ games: 10, type: 'knockout' });
      });

      it('generates 760 minutes needed', () => {
        // selector(10, 2 areas) -> type 'pods', games 28 (from previous test logic for 10 teams/1 area)
        // Tourney games = 28. PO games = 10.
        // tourneyAreaLength = calcAreaLength(28 games / 2 areas) = floor(14)+0 = 14 "effective rounds"
        // playoffAreaLength = calcAreaLength(10 games / 2 areas) = floor(5)+0 = 5 "effective rounds"
        // Total time = 14 * (30+10) + 5 * (30+10) = 14*40 + 5*40 = 560 + 200 = 760. This matches.
        expect(result.timeNeededMinutes).to.eq(760);
      });

      it('generates a 28 game tourney schedule', () => {
        expect(result.tourneySchedule).to.eql({
          games: 28,
          type: 'pods',
          areas: 2,
        });
      });

      it('generates a schedule containing 19 effective rounds', () => {
        // 14 from tourney + 5 from playoff = 19
        expect(result.schedule.length).to.eq(19);
      });
    });
  });
});
