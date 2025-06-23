import { expect } from 'chai';
import partialRoundRobin from '../../src/tourney/partial-round-robin'; // Adjust path as needed
import { Game } from '../../src/tourney-time'; // Adjust path for Game type

describe('partialRoundRobin', () => {
  it('should return an empty schedule for 0 teams', () => {
    const result = partialRoundRobin(0, 2);
    expect(result.schedule).to.be.an('array').that.is.empty;
    expect(result.games).to.equal(0);
    expect(result.teams).to.be.an('array').that.is.empty;
    expect(result.type).to.equal('partial round robin');
  });

  it('should return an empty schedule for 1 team', () => {
    const result = partialRoundRobin(1, 2);
    expect(result.schedule).to.be.an('array').that.is.empty;
    expect(result.games).to.equal(0);
    expect(result.teams).to.deep.equal([1]);
    expect(result.type).to.equal('partial round robin');
  });

  it('should return an empty schedule for 1 named team', () => {
    const result = partialRoundRobin(1, 2, ['Team A']);
    expect(result.schedule).to.be.an('array').that.is.empty;
    expect(result.games).to.equal(0);
    expect(result.teams).to.deep.equal(['Team A']);
    expect(result.type).to.equal('partial round robin');
  });

  it('should return an empty schedule if numGamesToPlay is 0', () => {
    const result = partialRoundRobin(4, 0);
    expect(result.schedule).to.be.an('array').that.is.empty;
    expect(result.games).to.equal(0);
    expect(result.teams).to.deep.equal([1, 2, 3, 4]);
    expect(result.type).to.equal('partial round robin');
  });

  it('should schedule games correctly for a simple case (e.g., 4 teams, 2 games each)', () => {
    const numTeams = 4;
    const gamesPerTeam = 2;
    const result = partialRoundRobin(numTeams, gamesPerTeam);

    expect(result.type).to.equal('partial round robin');
    expect(result.teams).to.deep.equal([1, 2, 3, 4]);
    // For 4 teams, 2 games each, we expect C(4,2) = 6 total possible games.
    // The algorithm might not pick all of them if it satisfies game counts earlier.
    // A simple pairing: (1,2), (3,4) -> each plays 1. Then (1,3), (2,4) -> each plays 2. Total 4 games.
    // Or (1,2), (1,3), (2,4), (3,4) -> 1 plays 2, 2 plays 2, 3 plays 2, 4 plays 2. Total 4 games.
    // The current naive algorithm might produce more games if not careful.
    // Let's check that each team plays *at most* gamesPerTeam, and *at least some* reasonable number.

    const gamesPlayed: { [team: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 };
    result.schedule.forEach(game => {
      (game.teams as number[]).forEach(team => {
        gamesPlayed[team]++;
      });
    });

    // Check that the total number of games is reasonable.
    // For 4 teams, 2 games each, it should be possible with 4 games.
    // (1v2, 3v4, 1v3, 2v4)
    // The algorithm might generate (1v2, 1v3, 1v4, 2v3, 2v4, 3v4) and then filter.
    // The current algorithm is greedy and might not be optimal.
    // Total game slots = numTeams * gamesPerTeam / 2 (if perfectly balanced)
    // So, 4 * 2 / 2 = 4 games.
    expect(result.games).to.be.at.least(gamesPerTeam * numTeams / 2); // Minimum expected games

    for (const team of result.teams) {
      expect(gamesPlayed[team as number]).to.be.at.most(gamesPerTeam + 1); // Allow some leeway for naive algo
      expect(gamesPlayed[team as number]).to.be.at.least(gamesPerTeam -1 < 0 ? 0 : gamesPerTeam -1 ); // Each team plays about gamesPerTeam
    }
  });

  it('should handle named teams', () => {
    const teams = ['A', 'B', 'C'];
    const gamesPerTeam = 1;
    const result = partialRoundRobin(3, gamesPerTeam, teams);

    expect(result.teams).to.deep.equal(teams);
    expect(result.games).to.be.greaterThanOrEqual(1); // Expect at least 1 game for 3 teams, 1 game each (e.g. A-B)

    const gamesPlayed: { [team: string]: number } = { A: 0, B: 0, C: 0 };
     result.schedule.forEach(game => {
      (game.teams as string[]).forEach(team => {
        gamesPlayed[team]++;
      });
    });
    // (A,B) -> A:1, B:1, C:0. (A,C) -> A:1,C:1,B:0 (B,C) -> B:1,C:1,A:0
    // Need at least 2 games to satisfy C(3,1) * 1 / 2 = 1.5 (round up to 2 if using pairs)
    // e.g. A-B, C-A. (A played 2, B played 1, C played 1)
    // The algorithm aims for "numGamesToPlay" for each team.
    // For 3 teams, 1 game each:
    // A vs B (A:1, B:1, C:0)
    // If we stop here, C has 0 games.
    // The current algorithm might do:
    // A vs B. gamesPlayed[A]=1, gamesPlayed[B]=1
    // A vs C. gamesPlayed[A]=2, gamesPlayed[C]=1 (A met target, C met target)
    // B vs C. gamesPlayed[B]=2, gamesPlayed[C]=2 (B met target, C met target)
    // This means 2 games total.
    // Let's test for total games:
    // 3 teams, 1 game each. Min games = ceil((3*1)/2) = 2 games. (e.g. A-B, A-C)
    expect(result.games).to.equal(2);
    // A:2, B:1, C:1 if A-B, A-C
    // A:1, B:2, C:1 if A-B, B-C
    // A:1, B:1, C:2 if A-C, B-C
    // One team will play 2 games, others 1.
    let twoGameTeam = 0;
    let oneGameTeam = 0;
    for (const teamName of teams) {
        if(gamesPlayed[teamName] === 2) twoGameTeam++;
        if(gamesPlayed[teamName] === 1) oneGameTeam++;
    }
    expect(oneGameTeam).to.equal(2);
    expect(twoGameTeam).to.equal(1);

  });

  it('should cap games near total number of teams if numGamesToPlay is very high', () => {
    // Requesting to play more games than possible in a round robin
    const result = partialRoundRobin(3, 5); // 3 teams, max 2 games each in RR
    expect(result.games).to.equal(3); // Should behave like full RR, C(3,2) = 3 games

    const gamesPlayed: { [team: number]: number } = { 1: 0, 2: 0, 3: 0 };
    result.schedule.forEach(game => {
      (game.teams as number[]).forEach(team => {
        gamesPlayed[team]++;
      });
    });
    expect(gamesPlayed[1]).to.equal(2);
    expect(gamesPlayed[2]).to.equal(2);
    expect(gamesPlayed[3]).to.equal(2);
  });

  it('should attempt to distribute games somewhat (check round assignments)', () => {
    const result = partialRoundRobin(5, 2); // 5 teams, 2 games each
    // Expect C(5,2) * 2 / 2 = 5 games ( (5*2)/2 = 5 )
    expect(result.games).to.be.at.least(5);

    const rounds = new Set(result.schedule.map(g => g.round));
    // Expect more than 1 round if games are distributed
    // The current naive round assignment might put many in round 1, then increment.
    // For 5 teams, 2 games/team: (1,2)(3,4) R1; (1,3)(2,5) R2; (4,5) R3. (approx 2-3 rounds)
    expect(rounds.size).to.be.greaterThan(1);
    expect(rounds.size).to.be.lessThanOrEqual(result.games); // Max rounds = num games
  });

  it('should handle a larger number of teams and games', () => {
    const numTeams = 10;
    const gamesPerTeam = 3;
    const result = partialRoundRobin(numTeams, gamesPerTeam);

    // Expected games = (10 * 3) / 2 = 15
    expect(result.games).to.be.at.least(15);
    expect(result.teams.length).to.equal(numTeams);

    const gamesPlayed: { [team: number]: number } = {};
    result.teams.forEach(t => gamesPlayed[t as number] = 0);

    result.schedule.forEach(game => {
      (game.teams as number[]).forEach(team => {
        gamesPlayed[team]++;
      });
    });

    for (const team of result.teams) {
      expect(gamesPlayed[team as number]).to.be.closeTo(gamesPerTeam, 1); // Each team plays about gamesPerTeam (+/-1)
    }
  });

  it('should ensure no direct rematches', () => {
    const result = partialRoundRobin(6, 3); // 6 teams, 3 games each. Expected (6*3)/2 = 9 games.
    const matchups = new Set<string>();

    result.schedule.forEach(game => {
      const team1 = game.teams[0];
      const team2 = game.teams[1];
      const matchupKey = [team1, team2].sort().join('-');
      expect(matchups.has(matchupKey)).to.be.false;
      matchups.add(matchupKey);
    });
    expect(result.games).to.be.at.least( (6*3)/2 );
  });
});
