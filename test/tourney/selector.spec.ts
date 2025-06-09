import { expect } from '../spec-helper';
import selector from '@lib/tourney/selector'; // Using path alias
import { Game, Schedule } from '@lib/tourney-time'; // Assuming types

interface SelectorResult extends Schedule {
  areas?: number; // selector function adds/modifies areas property
  // It also returns type, games, schedule from underlying functions
}

describe('tourney/selector', () => {
  let results: SelectorResult | null = null; // Explicitly typed

  describe('given number of teams less than 9', () => {
    beforeEach(() => {
      // Assuming selector takes (teams, areas)
      // The original CoffeeScript selector(2,1)
      results = selector(2, 1);
    });

    it('returns object with type "round robin"', () => {
      expect(results?.type).to.eq('round robin');
    });

    it('returns object containing number of games', () => {
      expect(results?.games).to.eq(1);
    });

    it('returns object containing a schedule', () => {
      // For 2 teams, 1 area, it's a round robin.
      // Schedule for roundRobin(2) is now [{id:'g0-0',round:1,teams:[2,1]}]
      expect(results?.schedule).to.eql([
        { id: 'g0-0', round: 1, teams: [2, 1] as any }, // Updated ID
      ]);
    });

    it('returns object containing number of areas', () => {
      expect(results?.areas).to.eq(1);
    });
  });

  describe('given number of teams greater than 8', () => {
    describe('and number of areas less than teams / 4', () => {
      beforeEach(() => {
        // 9 teams, 2 areas. 2 < 9/4 (2.25) is false.
        // However, the logic in selector might be integer division or specific thresholds.
        // The original 'tourney/selector.coffee' logic is:
        // if teams < 9 or areas > Math.floor(teams / 4)
        //   # round robin
        // else
        //   # pods
        // For selector(9, 2): teams = 9, areas = 2. Math.floor(9/4) = 2.
        // areas > Math.floor(teams/4) is 2 > 2, which is false. So it SHOULD go to 'pods'.
        results = selector(9, 2);
      });

      it('returns object with type "pods"', () => {
        expect(results?.type).to.eq('pods');
      });

      it('returns object containing number of games', () => {
        // pods(9) would be 2 pods (one of 5, one of 4) or similar distribution.
        // If it's 3 pods of 3: pod games = 3*3=9. Div games for 3 div = 3*1=3. Crossover for 3 div = (3-1)*2=4. Total 9+3+4 = 16.
        // The original test expects 22 games, which matches pods(8) logic.
        // Let's check pods(9) based on current teams-in-pods logic:
        // names = [1..9], teamsInPodsCount = 4 (default in pods/index.coffee)
        // teams=9, teamsInPodsCount=4. numOfPodsBase=2, leftOverTeams=1. effectiveNumOfPods=3.
        // Pods: "1":[1,4,7], "2":[2,5,8], "3":[3,6,9]
        // Pod games: 3 games per pod * 3 pods = 9 games.
        // Divisions: (teams-in-divisions with these 3 pods of 3) -> 3 divisions of 3 teams. Each RR(3) = 3 actual games. Total 3*3=9 actual.
        // Crossover games (3 divisions): (3-1)*2 = 4 actual games.
        // Total actual games = 9 (pod) + 9 (division) + 4 (crossover) = 22 actual games.
        // Total schedule items (including byes from RR(3)):
        // Pod items: 3 * (3g+3b=6i) = 18 items.
        // Division items: 3 * (3g+3b=6i) = 18 items.
        // Crossover items: 4 games.
        // Total items = 18 + 18 + 4 = 40 items.
        expect(results?.games).to.eq(22); // Actual games
      });

      describe('returns object containing a schedule', () => {
        it('should have a schedule property that is ok', () => {
          expect(results?.schedule).to.be.ok; // .ok checks for truthy value
        });
        it('should have a schedule with 40 items', () => {
          expect(results!.schedule!.length).to.eq(40); // Total schedule items
        });
      });

      it('returns object containing number of areas', () => {
        expect(results?.areas).to.eq(2);
      });
    });

    describe('and number of areas > teams / 4 but <= teams / 2', () => {
      beforeEach(() => {
        // selector(10, 4)
        // teams = 10, areas = 4. Math.floor(teams / 4) = Math.floor(10/4) = 2.
        // areas > Math.floor(teams/4) is 4 > 2, which is true. So it SHOULD go to 'round robin'.
        results = selector(10, 4);
      });

      it('returns object with type "round robin"', () => {
        expect(results?.type).to.eq('round robin');
      });

      it('returns object containing number of games', () => {
        // roundRobin(10) games = (10 * 9) / 2 = 45 games.
        expect(results?.games).to.eq(45);
      });

      describe('returns object containing a schedule', () => {
        it('should have a schedule property that is ok', () => {
          expect(results?.schedule).to.be.ok;
        });
        it('should have a schedule with 45 items', () => {
          expect(results!.schedule!.length).to.eq(45);
        });
      });

      it('returns object containing number of areas', () => {
        expect(results?.areas).to.eq(4);
      });
    });

    describe('and number of areas > teams / 2', () => {
      beforeEach(() => {
        // selector(10, 10)
        // teams = 10, areas = 10. Math.floor(teams / 4) = 2.
        // areas > Math.floor(teams/4) is 10 > 2, which is true. So 'round robin'.
        // Then, areas > teams / 2?  10 > 10/2 (5) is true.
        // So areas should be reduced to Math.ceil(teams / 2) = Math.ceil(10/2) = 5.
        results = selector(10, 10);
      });

      describe('reduces number of areas to teams / 2', () => {
        it('should set areas to 5', () => {
          expect(results?.areas).to.eq(5);
        });
        it('should set type to round robin', () => {
          // It should still be round robin type
          expect(results?.type).to.eq('round robin');
        });
        it('should set games to 45', () => {
          expect(results?.games).to.eq(45); // Games for roundRobin(10)
        });
      });
    });
  });
});
