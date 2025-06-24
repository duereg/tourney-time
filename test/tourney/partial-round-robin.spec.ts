import { expect } from 'chai';
import partialRoundRobin from '../../src/tourney/partial-round-robin'; // Adjust path as needed
// import { Game } from '../../src/tourney-time'; // Adjust path for Game type - Removed as unused

describe('partialRoundRobin', () => {
  describe('when called with 0 teams', () => {
    const result = partialRoundRobin(0, 2);
    it('should return an empty schedule array', () => {
      expect(result.schedule).to.be.an('array').that.is.empty;
    });
    it('should return 0 games', () => {
      expect(result.games).to.equal(0);
    });
    it('should return an empty teams array', () => {
      expect(result.teams).to.be.an('array').that.is.empty;
    });
    it('should return type "partial round robin"', () => {
      expect(result.type).to.equal('partial round robin');
    });
  });

  describe('when called with 1 team', () => {
    const result = partialRoundRobin(1, 2);
    it('should return an empty schedule array', () => {
      expect(result.schedule).to.be.an('array').that.is.empty;
    });
    it('should return 0 games', () => {
      expect(result.games).to.equal(0);
    });
    it('should return a teams array with that one team', () => {
      expect(result.teams).to.deep.equal([1]);
    });
    it('should return type "partial round robin"', () => {
      expect(result.type).to.equal('partial round robin');
    });
  });

  describe('when called with 1 named team', () => {
    const result = partialRoundRobin(1, 2, ['Team A']);
    it('should return an empty schedule array', () => {
      expect(result.schedule).to.be.an('array').that.is.empty;
    });
    it('should return 0 games', () => {
      expect(result.games).to.equal(0);
    });
    it('should return a teams array with that one named team', () => {
      expect(result.teams).to.deep.equal(['Team A']);
    });
    it('should return type "partial round robin"', () => {
      expect(result.type).to.equal('partial round robin');
    });
  });

  describe('when numGamesToPlay is 0', () => {
    const result = partialRoundRobin(4, 0);
    it('should return an empty schedule array', () => {
      expect(result.schedule).to.be.an('array').that.is.empty;
    });
    it('should return 0 games', () => {
      expect(result.games).to.equal(0);
    });
    it('should return a teams array with all teams', () => {
      expect(result.teams).to.deep.equal([1, 2, 3, 4]);
    });
    it('should return type "partial round robin"', () => {
      expect(result.type).to.equal('partial round robin');
    });
  });

  describe('for a simple case (e.g., 4 teams, 2 games each)', () => {
    const numTeams = 4;
    const gamesPerTeam = 2;
    const result = partialRoundRobin(numTeams, gamesPerTeam);
    const gamesPlayed: { [team: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 };
    result.schedule.forEach(game => {
      (game.teams as number[]).forEach(team => {
        gamesPlayed[team]++;
      });
    });

    it('should return type "partial round robin"', () => {
      expect(result.type).to.equal('partial round robin');
    });
    it('should list all teams', () => {
      expect(result.teams).to.deep.equal([1, 2, 3, 4]);
    });
    it('should schedule a reasonable number of games', () => {
      // For 4 teams, 2 games each, it should be possible with 4 games.
      // (1v2, 3v4, 1v3, 2v4)
      // The algorithm might generate (1v2, 1v3, 1v4, 2v3, 2v4, 3v4) and then filter.
      // The current algorithm is greedy and might not be optimal.
      // Total game slots = numTeams * gamesPerTeam / 2 (if perfectly balanced)
      // So, 4 * 2 / 2 = 4 games.
      expect(result.games).to.be.at.least(gamesPerTeam * numTeams / 2); // Minimum expected games
    });

    result.teams.forEach(team => {
      describe(`team ${team} games played`, () => {
        it(`should play at most ${gamesPerTeam + 1} games`, () => {
          expect(gamesPlayed[team as number]).to.be.at.most(gamesPerTeam + 1); // Allow some leeway for naive algo
        });
        it(`should play at least ${Math.max(0, gamesPerTeam - 1)} games`, () => {
          expect(gamesPlayed[team as number]).to.be.at.least(Math.max(0, gamesPerTeam - 1)); // Each team plays about gamesPerTeam
        });
      });
    });
  });

  describe('when handling named teams (3 teams, 1 game each)', () => {
    const teams = ['A', 'B', 'C'];
    const gamesPerTeam = 1;
    const result = partialRoundRobin(3, gamesPerTeam, teams);
    const gamesPlayed: { [team: string]: number } = { A: 0, B: 0, C: 0 };
    result.schedule.forEach(game => {
      (game.teams as string[]).forEach(team => {
        gamesPlayed[team]++;
      });
    });

    let twoGameTeamCount = 0;
    let oneGameTeamCount = 0;
    for (const teamName of teams) {
      if (gamesPlayed[teamName] === 2) twoGameTeamCount++;
      if (gamesPlayed[teamName] === 1) oneGameTeamCount++;
    }

    it('should list the correct team names', () => {
      expect(result.teams).to.deep.equal(teams);
    });
    it('should schedule at least 1 game', () => {
      expect(result.games).to.be.greaterThanOrEqual(1);
    });
    it('should result in 2 total games', () => {
      // 3 teams, 1 game each. Min games = ceil((3*1)/2) = 2 games. (e.g. A-B, A-C)
      expect(result.games).to.equal(2);
    });
    it('should have two teams playing 1 game', () => {
      expect(oneGameTeamCount).to.equal(2);
    });
    it('should have one team playing 2 games', () => {
      expect(twoGameTeamCount).to.equal(1);
    });
  });

  describe('when numGamesToPlay is very high (3 teams, 5 games requested)', () => {
    // Requesting to play more games than possible in a round robin
    const result = partialRoundRobin(3, 5); // 3 teams, max 2 games each in RR
    const gamesPlayed: { [team: number]: number } = { 1: 0, 2: 0, 3: 0 };
    result.schedule.forEach(game => {
      (game.teams as number[]).forEach(team => {
        gamesPlayed[team]++;
      });
    });

    it('should cap games at the total possible for a full round robin (3 games)', () => {
      expect(result.games).to.equal(3); // Should behave like full RR, C(3,2) = 3 games
    });
    it('should ensure team 1 plays 2 games', () => {
      expect(gamesPlayed[1]).to.equal(2);
    });
    it('should ensure team 2 plays 2 games', () => {
      expect(gamesPlayed[2]).to.equal(2);
    });
    it('should ensure team 3 plays 2 games', () => {
      expect(gamesPlayed[3]).to.equal(2);
    });
  });

  describe('round assignment distribution (5 teams, 2 games each)', () => {
    const result = partialRoundRobin(5, 2); // 5 teams, 2 games each
    const rounds = new Set(result.schedule.map(g => g.round));

    it('should schedule at least 5 games', () => {
      // Expect C(5,2) * 2 / 2 = 5 games ( (5*2)/2 = 5 )
      expect(result.games).to.be.at.least(5);
    });
    it('should use more than 1 round', () => {
      // Expect more than 1 round if games are distributed
      // The current naive round assignment might put many in round 1, then increment.
      // For 5 teams, 2 games/team: (1,2)(3,4) R1; (1,3)(2,5) R2; (4,5) R3. (approx 2-3 rounds)
      expect(rounds.size).to.be.greaterThan(1);
    });
    it('should use a number of rounds less than or equal to the number of games', () => {
      expect(rounds.size).to.be.lessThanOrEqual(result.games); // Max rounds = num games
    });
  });

  describe('for a larger number of teams and games (10 teams, 3 games each)', () => {
    const numTeams = 10;
    const gamesPerTeam = 3;
    const result = partialRoundRobin(numTeams, gamesPerTeam);
    const gamesPlayed: { [team: number]: number } = {};
    result.teams.forEach(t => gamesPlayed[t as number] = 0);
    result.schedule.forEach(game => {
      (game.teams as number[]).forEach(team => {
        gamesPlayed[team]++;
      });
    });

    it('should schedule at least 15 games', () => {
      // Expected games = (10 * 3) / 2 = 15
      expect(result.games).to.be.at.least(15);
    });
    it('should include all teams in the teams list', () => {
      expect(result.teams.length).to.equal(numTeams);
    });
    result.teams.forEach(team => {
      it(`team ${team} should play close to ${gamesPerTeam} games (+/-1)`, () => {
        expect(gamesPlayed[team as number]).to.be.closeTo(gamesPerTeam, 1);
      });
    });
  });

  describe('ensuring no direct rematches (6 teams, 3 games each)', () => {
    const result = partialRoundRobin(6, 3); // 6 teams, 3 games each. Expected (6*3)/2 = 9 games.
    const matchups = new Set<string>();
    let hasRematch = false;
    result.schedule.forEach(game => {
      const team1 = game.teams[0];
      const team2 = game.teams[1];
      const matchupKey = [team1, team2].sort().join('-');
      if (matchups.has(matchupKey)) {
        hasRematch = true;
      }
      matchups.add(matchupKey);
    });

    it('should not have any direct rematches', () => {
      expect(hasRematch).to.be.false;
    });
    it('should schedule at least 9 games', () => {
      expect(result.games).to.be.at.least((6 * 3) / 2);
    });
  });
});
