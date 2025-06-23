import { expect } from '../spec-helper';
// Old imports and interface removed below

import selectorFromLib, { TourneyResultBase } from '@lib/tourney/selector'; // Using path alias and importing type
import { Game, Schedule, SchedulingStrategy } from '@lib/tourney-time'; // Assuming types

// Renaming selector to avoid conflict with Mocha's context/describe, if any issues arise.
// And to match the actual exported name if it's default.
const selectTourneyType = selectorFromLib;


describe('tourney/selector', () => {
  let results: TourneyResultBase | null = null;

  // Helper to reset results before each test if needed, though direct assignment in beforeEach is also fine.
  // afterEach(() => {
  //   results = null;
  // });

  describe('Default strategy (round-robin) if strategy is not provided', () => {
    beforeEach(() => {
      results = selectTourneyType({ teams: 2, areas: 1 }); // No strategy, should default to round-robin
    });

    it('returns object with type "round robin"', () => {
      expect(results?.type).to.eq('round robin');
    });
    it('returns 1 game for 2 teams', () => {
      expect(results?.games).to.eq(1);
    });
    it('returns correct schedule for 2 teams', () => {
      expect(results?.schedule).to.eql([
        { id: 'g0-0', round: 1, teams: [2, 1] as any },
      ]);
    });
     it('returns correct number of areas', () => {
      expect(results?.areas).to.eq(1);
    });
  });

  describe('Explicit "round-robin" strategy', () => {
    beforeEach(() => {
      results = selectTourneyType({ teams: 4, areas: 2, strategy: 'round-robin' });
    });

    it('returns object with type "round robin"', () => {
      expect(results?.type).to.eq('round robin');
    });
    it('returns 6 games for 4 teams', () => {
      expect(results?.games).to.eq(6); // C(4,2) = 6
    });
    it('area adjustment: 4 teams, 3 areas requested, should use 2 areas', () => {
      const newResults = selectTourneyType({ teams: 4, areas: 3, strategy: 'round-robin' });
      expect(newResults?.areas).to.eq(2); // Max areas for 4 teams is 4/2=2
    });
    it('area adjustment: 4 teams, 0 areas requested, should use 1 area', () => {
      const newResults = selectTourneyType({ teams: 4, areas: 0, strategy: 'round-robin' });
      expect(newResults?.areas).to.eq(1);
    });
  });

  describe('Explicit "pods" strategy', () => {
    beforeEach(() => {
      // For pods, the old auto-selection logic (teams > 8 && areas <= teams/4) is bypassed.
      // We directly request pods.
      results = selectTourneyType({ teams: 9, areas: 2, strategy: 'pods' });
    });

    it('returns object with type "pods"', () => {
      expect(results?.type).to.eq('pods');
    });
    it('returns 22 games for 9 teams in pods', () => {
      // Calculation based on pods(9) from previous tests:
      // Pods: 3 pods of 3 teams each (e.g., [1,4,7], [2,5,8], [3,6,9])
      // Pod games: 3 pods * C(3,2) games/pod = 3 * 3 = 9 actual games
      // Divisions: 3 divisions from these pods (e.g., 1st places, 2nd places, 3rd places)
      // Division games: 3 divisions * C(3,2) games/div = 3 * 3 = 9 actual games
      // Crossover games (for 3 divisions): (3-1)*2 = 4 actual games
      // Total actual games = 9 (pod) + 9 (division) + 4 (crossover) = 22 games.
      expect(results?.games).to.eq(22);
    });
     it('returns correct number of areas (not adjusted by RR logic for pods)', () => {
      expect(results?.areas).to.eq(2);
    });
     it('returns empty schedule if less than 2 teams for pods, defaults to RR type', () => {
      const podResults1Team = selectTourneyType({ teams: 1, areas: 1, strategy: 'pods' });
      expect(podResults1Team.type).to.eq('round robin'); // Defaulted from pods
      expect(podResults1Team.games).to.eq(0);
      expect(podResults1Team.schedule).to.be.empty;

      const podResults0Team = selectTourneyType({ teams: 0, areas: 1, strategy: 'pods' });
      expect(podResults0Team.type).to.eq('round robin'); // Defaulted from pods
      expect(podResults0Team.games).to.eq(0);
      expect(podResults0Team.schedule).to.be.empty;
    });
  });

  describe('Explicit "partial-round-robin" strategy', () => {
    it('returns partial round robin schedule', () => {
      const numTeams = 6;
      const numGamesPerTeam = 2;
      // Expected games for 6 teams, 2 games each = (6 * 2) / 2 = 6 games.
      // The partialRoundRobin function might produce slightly more or less based on exact pairing.
      // Test from partial-round-robin.spec: 6 teams, 2 games -> result.games = 6
      results = selectTourneyType({
        teams: numTeams,
        areas: 3, // Max areas = 6/2 = 3
        strategy: 'partial-round-robin',
        numGamesPerTeam,
      });
      expect(results?.type).to.eq('partial round robin');
      expect(results?.games).to.be.at.least( (numTeams * numGamesPerTeam) / 2 ); // Should be around this
      expect(results?.areas).to.eq(3);
    });

    it('handles 0 numGamesPerTeam by defaulting to full round-robin for >=2 teams', () => {
       results = selectTourneyType({
        teams: 4,
        areas: 1,
        strategy: 'partial-round-robin',
        numGamesPerTeam: 0,
      });
      expect(results?.type).to.eq('round robin'); // Defaulted
      expect(results?.games).to.eq(6); // Full RR for 4 teams
    });

    it('handles 0 numGamesPerTeam by returning empty for <2 teams (via RR default)', () => {
       results = selectTourneyType({
        teams: 1,
        areas: 1,
        strategy: 'partial-round-robin',
        numGamesPerTeam: 0,
      });
      expect(results?.type).to.eq('partial round robin'); // Stays partial for 0/1 team
      expect(results?.games).to.eq(0);
    });


    it('area adjustment for partial-round-robin', () => {
      const newResults = selectTourneyType({
        teams: 6,
        areas: 4, // More than 6/2=3
        strategy: 'partial-round-robin',
        numGamesPerTeam: 2,
      });
      expect(newResults?.areas).to.eq(3);
    });
  });

  // These describe blocks replicate the original tests' scenarios but with explicit strategy.
  // The original tests were implicitly testing the auto-selection logic.
  // Since auto-selection is removed in favor of explicit strategy, these tests
  // now confirm that if 'round-robin' or 'pods' is chosen, the behavior is as expected.

  describe('Scenario: 9 teams, 2 areas, strategy "pods" (was auto pods)', () => {
    // This used to be auto-selected as pods.
    // selector(9, 2) -> teams=9, areas=2. Math.floor(9/4)=2. areas <= floor(teams/4) is 2<=2 (true).
    // Old logic: pods. New logic: if strategy: 'pods', then pods.
    beforeEach(() => {
      results = selectTourneyType({ teams: 9, areas: 2, strategy: 'pods' });
    });
    it('returns type "pods"', () => expect(results?.type).to.eq('pods'));
    it('returns 22 games', () => expect(results?.games).to.eq(22));
    it('schedule has 40 items', () => expect(results!.schedule!.length).to.eq(40));
    it('areas is 2', () => expect(results?.areas).to.eq(2));
  });

  describe('Scenario: 10 teams, 4 areas, strategy "round-robin" (was auto round-robin)', () => {
    // selector(10, 4) -> teams=10, areas=4. Math.floor(10/4)=2. areas > floor(teams/4) is 4>2 (true).
    // Old logic: round-robin. New logic: if strategy: 'round-robin', then round-robin.
    beforeEach(() => {
      results = selectTourneyType({ teams: 10, areas: 4, strategy: 'round-robin' });
    });
    it('returns type "round robin"', () => expect(results?.type).to.eq('round robin'));
    it('returns 45 games', () => expect(results?.games).to.eq(45));
    it('schedule has 45 items', () => expect(results!.schedule!.length).to.eq(45));
    it('areas is 4', () => expect(results?.areas).to.eq(4)); // Not adjusted as 4 <= 10/2
  });

  describe('Scenario: 10 teams, 10 areas, strategy "round-robin" (was auto round-robin with area reduction)', () => {
    // selector(10,10) -> teams=10, areas=10. Math.floor(10/4)=2. areas > floor(teams/4) is 10>2 (true).
    // Old logic: round-robin. Then area reduction: 10 > 10/2 (true), so areas = 5.
    // New logic: if strategy: 'round-robin', then round-robin & area reduction.
    beforeEach(() => {
      results = selectTourneyType({ teams: 10, areas: 10, strategy: 'round-robin' });
    });
    it('areas reduced to 5', () => expect(results?.areas).to.eq(5));
    it('type is "round robin"', () => expect(results?.type).to.eq('round robin'));
    it('games is 45', () => expect(results?.games).to.eq(45));
  });
});
