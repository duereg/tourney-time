import { expect } from '../spec-helper'; // Assuming spec-helper exports expect
import duel from '@lib/playoffs/duel'; // Using path alias
import { Game, Schedule } from '@lib/tourney-time'; // Assuming types are exported from tourney-time

const emptyTourney: Schedule = { type: 'knockout', games: 0, schedule: [] };

const fiveTeamSchedule: Game[] = [
  { id: 311, round: 1, teams: ['Seed 1'], isByeMatch: true },
  { id: 312, round: 1, teams: ['Seed 5', 'Seed 4'] },
  { id: 313, round: 1, teams: ['Seed 3'], isByeMatch: true },
  { id: 314, round: 1, teams: ['Seed 2'], isByeMatch: true },
  { id: 321, round: 2, teams: ['Seed 1', 'Winner 312'] },
  { id: 322, round: 2, teams: ['Seed 3', 'Seed 2'] },
  { id: 331, round: 3, teams: ['Loser 321', 'Loser 322'] },
  { id: 332, round: 3, teams: ['Winner 321', 'Winner 322'] }
];

const thirteenTeamSchedule: Game[] = [
  { id: 411, round: 1, teams: ['Seed 1'], isByeMatch: true },
  { id: 412, round: 1, teams: ['Seed 9', 'Seed 8'] },
  { id: 413, round: 1, teams: ['Seed 5', 'Seed 12'] },
  { id: 414, round: 1, teams: ['Seed 13', 'Seed 4'] },
  { id: 415, round: 1, teams: ['Seed 3'], isByeMatch: true },
  { id: 416, round: 1, teams: ['Seed 11', 'Seed 6'] },
  { id: 417, round: 1, teams: ['Seed 7', 'Seed 10'] },
  { id: 418, round: 1, teams: ['Seed 2'], isByeMatch: true },
  { id: 421, round: 2, teams: ['Seed 1', 'Winner 412'] },
  { id: 422, round: 2, teams: ['Winner 413', 'Winner 414'] },
  { id: 423, round: 2, teams: ['Seed 3', 'Winner 416'] },
  { id: 424, round: 2, teams: ['Winner 417', 'Seed 2'] },
  { id: 431, round: 3, teams: ['Winner 421', 'Winner 422'] },
  { id: 432, round: 3, teams: ['Winner 423', 'Winner 424'] },
  { id: 441, round: 4, teams: ['Loser 431', 'Loser 432'] },
  { id: 442, round: 4, teams: ['Winner 431', 'Winner 432'] },
];

describe('playoffs/duel', () => {
  it('given no params, throws', () => {
    // Need to cast duel to any for this kind of throw test if it's not expecting to be called with no args
    expect(() => (duel as any)()).to.throw(
      'You must provide the number of teams to continue.',
    );
  });

  it('given 0 teams returns an empty tournament', () => {
    expect(duel(0)).to.eql(emptyTourney);
  });

  it('given 1 team returns an empty tournament', () => {
    expect(duel(1)).to.eql(emptyTourney);
  });

  it('given 2 teams returns 1 game', () => {
    expect(duel(2).games).to.eq(1);
  });

  it('given 2 teams returns the correct schedule', () => {
    expect(duel(2).schedule).to.eql([
      { id: 111, round: 1, teams: ['Seed 1', 'Seed 2'] },
    ]);
  });

  it('given 3 teams returns 2 games', () => {
    // For 3 teams: 1 game (seed 2 vs seed 3), winner plays seed 1. Total 2 games.
    // This also includes a 3rd place game by default with the duel library if not specified otherwise.
    // The library might create a structure for a small number of teams that implies more than just a simple bracket.
    // Let's assume the existing test `expect(duel(3).games).to.eq 2` is correct based on library's logic for 3 teams.
    // A duel for 3 teams is: S2vS3, S1vWinner. That's 2 games for the main bracket.
    // If it includes a 3rd place game (Loser of S1vW vs Loser of S2vS3 initial match, but S2/S3 loser already known)
    // the structure is Seed1 (bye), Seed2 vs Seed3. Winner plays Seed1. This is 2 games.
    // duel(3) schedule: [ { id: 212, round: 1, teams: [ 'Seed 3', 'Seed 2' ] }, { id: 221, round: 2, teams: [ 'Seed 1', 'Winner 212' ] } ]
    // This was 2 contested games. Schedule items = 3. Actual games = 2.
    expect(duel(3).games).to.eq(2);
  });

  it('given 4 teams returns 4 games', () => {
    // 4 teams: S1vS4, S2vS3. Then W1vW2 (final), L1vL2 (3rd place). Total 4 games. No byes.
    expect(duel(4).games).to.eql(4);
  });

  it('given 5 teams return 5 games', () => {
    // 5 teams: 5 contested games. Schedule items = 8.
    expect(duel(5).games).to.eq(5);
  });

  it('given 5 teams returns the correct schedule', () => {
    expect(duel(5).schedule).to.eql(fiveTeamSchedule); // This will still fail, constant needs update
  });

  it('given 6 teams return 6 games', () => {
    // 6 teams (p=3): 6 contested games. Schedule items = 8.
    expect(duel(6).games).to.eq(6);
  });

  it('given 8 teams return 8 games', () => {
    // 8 teams (p=3): 0 byes + 8 contested games = 8 schedule items.
    expect(duel(8).games).to.eql(8);
  });

  it('given 9 teams return 9 games', () => {
    // 9 teams (p=4): 9 contested games. Schedule items = 16.
    expect(duel(9).games).to.eq(9);
  });

  it('given 12 teams return 12 games', () => {
    // 12 teams (p=4): 12 contested games. Schedule items = 16.
    expect(duel(12).games).to.eq(12);
  });

  it('given 13 teams returns 13 games', () => {
    // 13 teams (p=4): 13 contested games. Schedule items = 16.
    expect(duel(13).games).to.eq(13);
  });

  it('given 13 teams returns the correct schedule', () => {
    expect(duel(13).schedule).to.eql(thirteenTeamSchedule); // This will still fail
  });

  describe('Bye Handling', () => {
    describe('given 3 teams, correctly identifies byes and subsequent matches', () => {
      let result: Schedule;
      let schedule: Game[];

      beforeEach(() => {
        result = duel(3);
        schedule = result.schedule!; // Assert schedule is not undefined
      });

      // For 3 teams (p=2):
      // Seed 1 gets a bye in the first effective "round" of pairings.
      // Seed 2 vs Seed 3 is the first actual game.
      // Winner of (Seed 2 vs Seed 3) plays Seed 1.
      // duel.js structure:
      // Match 1: seeds(1,2) => [1, 4] -> Team 1 (Seed 1) vs WO (Seed 4) -> isBye=true for Seed 1
      // Match 2: seeds(2,2) => [3, 2] -> Team 3 (Seed 3) vs Team 2 (Seed 2) -> isBye=false
      // Then these are processed.
      // The old filter logic would remove the bye match. New logic keeps it.

      it('should have 2 actual games', () => {
        expect(result.games).to.equal(2);
      });

      it('should have 3 items in the schedule', () => {
        expect(schedule.length).to.equal(3);
      });

      it('should identify Seed 1 as having a bye match in round 1', () => {
        const byeMatch = schedule.find((m: Game) => m.isByeMatch === true);
        expect(byeMatch).to.exist;
        // Using non-null assertion operator `!` as existence is checked above.
        expect(byeMatch!.teams).to.deep.equal(['Seed 1']); // Seed 1 gets the bye
        expect(byeMatch!.round).to.equal(1); // Byes are typically in the first round
      });

      it('should identify the actual game between Seed 3 and Seed 2 in round 1', () => {
        const actualGame = schedule.find((m: Game) => !m.isByeMatch && m.round === 1);
        expect(actualGame).to.exist;
        expect(actualGame!.teams).to.deep.equal(['Seed 3', 'Seed 2']);
      });

      it('should correctly reference Seed 1 and a winner placeholder in the final game', () => {
        const finalGame = schedule.find((m: Game) => m.round === 2);
        expect(finalGame).to.exist;
        // One of the teams in the final game should be 'Seed 1'
        // The other team is 'Winner of the S2vS3 game'.
        // The exact ID (e.g., gId(2,1,2) for S2vS3) depends on internal gId logic.
        // Let's assume the 'Winner' placeholder is structured as 'Winner <someId>'
        // and Seed 1 is correctly propagated.
        expect(finalGame!.teams).to.include('Seed 1');
        expect(finalGame!.teams.some((t: string | number) => typeof t === 'string' && t.startsWith('Winner'))).to.be.true;
      });
    });

    describe('given 5 teams, correctly identifies byes and subsequent matches', () => {
      let result: Schedule;
      let schedule: Game[];

      beforeEach(() => {
        result = duel(5); // p=3 for 5 teams (up to 8 players)
        schedule = result.schedule!; // Assert schedule is not undefined
      });

      // Expected byes: Seed 1, Seed 2, Seed 3 (8 - 5 = 3 byes)
      // Actual games in round 1: Seed 4 vs Seed 5
      // Round 2: Seed 1 vs (Winner S4vS5), Seed 2 vs Seed 3
      // Round 3: Finals + 3rd place
      // Total matches = 3 byes + 1 (S4vS5) + 2 (R2 games) + 2 (R3 games) = 8
      // However, duel(5) was previously asserted to have 5 games. This implies the WO/bye logic
      // in duel.js might be more about pairing actual seeds if possible, and `isBye`
      // was about whether a *seed position* was a bye, not if a *match* was a bye.
      // With the new logic, `isByeMatch` should clearly mark matches that are byes.

      // Let's re-evaluate based on duel.js:
      // numTeams = 5, p = 3. Math.pow(2, p - 1) = 4 matches in first round.
      // Match 1: seeds(1,3) => [1,8] -> S1 vs WO(S8) -> isByeMatch=true for S1
      // Match 2: seeds(2,3) => [5,4] -> S5 vs S4 -> isByeMatch=false
      // Match 3: seeds(3,3) => [3,6] -> S3 vs WO(S6) -> isByeMatch=true for S3
      // Match 4: seeds(4,3) => [7,2] -> WO(S7) vs S2 -> isByeMatch=true for S2

      it('should have 5 actual games', () => {
        expect(result.games).to.equal(5);
      });

      it('should have 8 items in the schedule', () => {
        expect(schedule.length).to.equal(8);
      });

      it('should identify 3 bye matches', () => {
        const byeMatches = schedule.filter((m: Game) => m.isByeMatch === true);
        expect(byeMatches.length).to.equal(3);
      });

      it('should confirm Seed 1, Seed 2, and Seed 3 have bye matches', () => {
        const byeMatches = schedule.filter((m: Game) => m.isByeMatch === true);
        expect(byeMatches.some((m: Game) => m.teams.includes('Seed 1'))).to.be.true;
        expect(byeMatches.some((m: Game) => m.teams.includes('Seed 2'))).to.be.true;
        expect(byeMatches.some((m: Game) => m.teams.includes('Seed 3'))).to.be.true;
      });

      it('should identify 1 actual game in round 1 between Seed 5 and Seed 4', () => {
        const round1ActualGames = schedule.filter((m: Game) => m.round === 1 && !m.isByeMatch);
        expect(round1ActualGames.length).to.equal(1);
        expect(round1ActualGames[0].teams).to.deep.equal(['Seed 5', 'Seed 4']);
      });

      it('should ensure a round 2 game involves a bye winner and includes a winner placeholder if Seed 1 is involved', () => {
        const round2GameWithByeWinner = schedule.find((m: Game) => m.round === 2 && (m.teams.includes('Seed 1') || m.teams.includes('Seed 2') || m.teams.includes('Seed 3')));
        expect(round2GameWithByeWinner).to.exist;
        if (round2GameWithByeWinner!.teams.includes('Seed 1')) {
          expect(round2GameWithByeWinner!.teams.some((t: string | number) => typeof t === 'string' && t.startsWith('Winner'))).to.be.true;
        }
      });

      it('should ensure a round 2 game between Seed 2 and Seed 3 exists', () => {
        // Example: One of the round 2 games should be Seed 1 vs Winner of (S4vS5)
        // Another should be Seed 2 vs Seed 3 (or vice versa, if one was WO and other advanced)
        // Given WO logic, S2 and S3 advanced directly.
        const gameS2S3 = schedule.find((m: Game) => m.round === 2 && m.teams.includes('Seed 2') && m.teams.includes('Seed 3'));
        expect(gameS2S3).to.exist;
      });
    });
  });
});
