import { expect } from '../../spec-helper';
import teamsInDivisions from '@lib/tourney/pods/teams-in-divisions'; // Using path alias

// Define types for better clarity
type TeamName = string;
type Division = TeamName[];
// PodsInput should match the expectation of the module it's testing (string[])
type PodsInput = { [key: string]: string[] };

const firstDivisionExpected: Division = ['1st Pod 1', '1st Pod 2', '1st Pod 3'];

const secondDivisionExpected: Division = [
  '2nd Pod 1',
  '2nd Pod 2',
  '2nd Pod 3',
];

const thirdDivisionExpected: Division = ['3rd Pod 1', '3rd Pod 2', '3rd Pod 3'];

const partialFourthDivisionExpected: Division = ['4th Pod 1', '4th Pod 2'];

// Clone and extend for specific test cases
const fourthDivisionExpected: Division = [
  ...partialFourthDivisionExpected,
  '4th Pod 3',
];

const magicThirdDivisionExpected: Division = [
  ...thirdDivisionExpected,
  '4th Pod 1',
];

const nineTeamDivisionsResult: Division[] = [
  firstDivisionExpected,
  secondDivisionExpected,
  thirdDivisionExpected,
];

// For 10 teams, pod 1 gets an extra team, which becomes "4th Pod 1" and lands in the 3rd division.
const tenTeamDivisionsResult: Division[] = [
  firstDivisionExpected,
  secondDivisionExpected,
  magicThirdDivisionExpected, // 3rd Div Pod3, 4th Pod 1
];

const elevenTeamDivisionsResult: Division[] = [
  firstDivisionExpected,
  secondDivisionExpected,
  thirdDivisionExpected, // Pods 1, 2, 3 contribute their 3rd place teams
  partialFourthDivisionExpected, // Pods 1, 2 contribute their 4th place teams
];

const twelveTeamDivisionsResult: Division[] = [
  firstDivisionExpected,
  secondDivisionExpected,
  thirdDivisionExpected,
  fourthDivisionExpected,
];

describe('tourney/pods/teamsInDivisions', () => {
  it('given no params returns empty array', () => {
    // Updated description
    // Cast to any because the function expects arguments
    // Now returns [] instead of throwing due to source code change
    expect((teamsInDivisions as any)()).to.eql([]);
  });

  describe('given number of teams', () => {
    it('given no teams (empty pods object) returns empty array', () => {
      expect(teamsInDivisions({})).to.eql([]);
    });

    it('given 1 team in 1 pod returns an empty array (no divisions made from a single pod)', () => {
      // The function expects pods, and if only one pod, no inter-pod divisions are formed.
      expect(teamsInDivisions({ '1': ['1'] })).to.eql([]);
    });

    it('given 2 pods of 4 teams, returns four divisions', () => {
      const pods: PodsInput = {
        '1': ['1', '2', '3', '4'],
        '2': ['5', '6', '7', '8'],
      };
      // Each pod has 4 teams, so there will be up to 4 "ranks" (1st, 2nd, 3rd, 4th)
      // These ranks form the divisions. So, 4 divisions are expected.
      expect(teamsInDivisions(pods).length).to.eq(4);
    });

    it('given 9 teams for pods of 3 teams (3 pods), returns 3 divisions', () => {
      // Pods: {"1": ["1","4","7"], "2": ["2","5","8"], "3": ["3","6","9"]}
      // Div1: 1st P1, 1st P2, 1st P3
      // Div2: 2nd P1, 2nd P2, 2nd P3
      // Div3: 3rd P1, 3rd P2, 3rd P3
      const pods: PodsInput = {
        '1': ['1', '4', '7'],
        '2': ['2', '5', '8'],
        '3': ['3', '6', '9'],
      };
      expect(teamsInDivisions(pods)).to.eql(nineTeamDivisionsResult);
    });

    it('given 10 teams for pods of 4 teams (effectively 3 pods due to distribution), returns 3 divisions', () => {
      // Pods: {"1": ["1","4","7","10"], "2": ["2","5","8"], "3": ["3","6","9"]} (Pod 1 has 4 teams, others 3)
      // Max teams in any pod is 4.
      // Div1: 1st P1, 1st P2, 1st P3
      // Div2: 2nd P1, 2nd P2, 2nd P3
      // Div3: 3rd P1, 3rd P2, 3rd P3
      // Div4 (tiny): 4th P1  -- this gets merged into Div3
      // So, tenTeamDivisionsResult should reflect this merge.
      const pods: PodsInput = {
        '1': ['1', '4', '7', '10'],
        '2': ['2', '5', '8'],
        '3': ['3', '6', '9'],
      };
      expect(teamsInDivisions(pods)).to.eql(tenTeamDivisionsResult);
    });

    it('given 11 teams for pods of 4 teams (effectively 3 pods), returns 4 divisions', () => {
      // Pods: {"1": ["1","4","7","10"], "2": ["2","5","8","11"], "3": ["3","6","9"]} (Pods 1 & 2 have 4, Pod 3 has 3)
      // Max teams in any pod is 4.
      // Div1: 1st P1, 1st P2, 1st P3
      // Div2: 2nd P1, 2nd P2, 2nd P3
      // Div3: 3rd P1, 3rd P2, 3rd P3
      // Div4: 4th P1, 4th P2 (no merge as it's not a single team division)
      const pods: PodsInput = {
        '1': ['1', '4', '7', '10'],
        '2': ['2', '5', '8', '11'],
        '3': ['3', '6', '9'],
      };
      expect(teamsInDivisions(pods)).to.eql(elevenTeamDivisionsResult);
    });

    it('given 12 teams for pods of 4 teams (3 pods), returns 4 divisions', () => {
      // Pods: {"1": ["1","4","7","10"], "2": ["2","5","8","11"], "3": ["3","6","9","12"]} (All 3 pods have 4 teams)
      // Div1: 1st P1, 1st P2, 1st P3
      // Div2: 2nd P1, 2nd P2, 2nd P3
      // Div3: 3rd P1, 3rd P2, 3rd P3
      // Div4: 4th P1, 4th P2, 4th P3
      const pods: PodsInput = {
        '1': ['1', '4', '7', '10'],
        '2': ['2', '5', '8', '11'],
        '3': ['3', '6', '9', '12'],
      };
      expect(teamsInDivisions(pods)).to.eql(twelveTeamDivisionsResult);
    });
  });
});
