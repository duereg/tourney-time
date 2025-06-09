import { expect } from '../../spec-helper';
import teamsInPods from '@lib/tourney/pods/teams-in-pods'; // Using path alias

// Define types for better clarity
type Team = string; // Implementation expects team names to be strings
interface PodsOutput {
  [key: string]: Team[];
}

describe('tourney/pods/teams-in-pods', () => {
  it('given no params throws', () => {
    // Cast to any because the function expects arguments
    expect(() => (teamsInPods as any)()).to.throw(
      'Invalid arguments for teamsInPods: required parameters are missing or invalid.',
    );
  });

  describe('given number of teams', () => {
    it('given no teams returns empty object', () => {
      // teamsInPods([], 0) -> if teamsInPodsCount is 0, it might lead to issues like division by zero in the implementation.
      // The original test passes 0 for teamsInPodsCount. Let's assume the implementation handles this.
      // Based on the implementation of teams-in-pods.ts, if teamsInPodsCount <= 0, it returns {}.
      expect(teamsInPods([], 0)).to.eql({});
    });

    it('given 1 team returns 1 pod containing the 1 team', () => {
      // teamsInPods(["1"], 1)
      // teams = 1, teamsInPodsCount = 1. numOfPodsBase = 1. leftOverTeams = 0. effectiveNumOfPods = 1.
      // groupBy index 0 % 1 + 1 = pod '1'. Result: {'1': ["1"]}
      expect(teamsInPods(['1'], 1)).to.eql({ '1': ['1'] });
    });

    it('given 10 teams for pods of 4 teams, returns 3 pods', () => {
      // teamsInPods(["1".."10"], 4)
      // names = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
      // teamsInPodsCount = 4
      // teams = 10. numOfPodsBase = floor(10/4) = 2. leftOverTeams = 10 % 4 = 2.
      // effectiveNumOfPods = numOfPodsBase + 1 = 2 + 1 = 3.
      // index % 3 + 1:
      // "1" (idx 0): 0%3+1 = 1
      // "2" (idx 1): 1%3+1 = 2
      // "3" (idx 2): 2%3+1 = 3
      // "4" (idx 3): 3%3+1 = 1 -> 0%3+1 = 1
      // "5" (idx 4): 4%3+1 = 2
      // "6" (idx 5): 5%3+1 = 3
      // "7" (idx 6): 6%3+1 = 1
      // "8" (idx 7): 7%3+1 = 2
      // "9" (idx 8): 8%3+1 = 3
      // "10" (idx 9): 9%3+1 = 1
      // Pods:
      // "1": ["1", "4", "7", "10"]
      // "2": ["2", "5", "8"]
      // "3": ["3", "6", "9"]
      const teamNames = Array.from({ length: 10 }, (_, i) => String(i + 1)); // Creates ["1", "2", ..., "10"]
      const expectedPods: PodsOutput = {
        '1': ['1', '4', '7', '10'],
        '2': ['2', '5', '8'],
        '3': ['3', '6', '9'],
      };
      expect(teamsInPods(teamNames, 4)).to.eql(expectedPods);
    });
  });
});
