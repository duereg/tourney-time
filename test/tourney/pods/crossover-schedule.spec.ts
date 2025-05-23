import { expect } from '../../spec-helper';
import crossoverSchedule from '@lib/tourney/pods/crossover-schedule'; // Using path alias
import { Game } from '@lib/tourney-time'; // Assuming types

// Define types for better clarity, assuming Division is an array of teams (strings)
type TeamName = string;
type Division = TeamName[]; // A division is an array of team names (e.g., "1st Pod 1")

const firstDivision: Division = [
  "1st Pod 1",
  "1st Pod 2",
  "1st Pod 3",
];

const secondDivision: Division = [
  "2nd Pod 1",
  "2nd Pod 2",
  "2nd Pod 3",
];

const thirdDivision: Division = [
  "3rd Pod 1",
  "3rd Pod 2",
  "3rd Pod 3",
];

// The original CoffeeScript had `fourDivisions` as the last element in the `fourDivisions` array.
// This was likely a typo and meant `partialFourthDivision`.
const partialFourthDivision: Division = [
  "4th Pod 1",
  "4th Pod 2",
];

const oneDivisionSet: Division[] = [firstDivision];
const twoDivisionsSet: Division[] = [firstDivision, secondDivision];
const threeDivisionsSet: Division[] = [firstDivision, secondDivision, thirdDivision];
// Correcting the typo in the definition of fourDivisionsSet:
const fourDivisionsSet: Division[] = [firstDivision, secondDivision, thirdDivision, partialFourthDivision];


// Define the expected schedule type more accurately if possible.
// Game interface from tourney-time might be suitable.
const twoDivisionScheduleResult: Game[] = [
  {
    id: "Div 1/2 <-1->",
    teams: ["2nd Div 1", "2nd Div 2"],
  },
  {
    id: "Div 1/2 <-2->",
    teams: ["3rd Div 1", "1st Div 2"],
  },
];

describe('tourney/pods/crossoverSchedule', () => {
  it('given no params throws', () => {
    // Cast to any because the function expects arguments
    expect(() => (crossoverSchedule as any)()).to.throw("You must provide divisions to generate the crossover games");
  });

  describe('given divisions', () => {
    it('given no teams returns empty array', () => {
      expect(crossoverSchedule([])).to.eql([]);
    });

    it('given 1 division returns an empty array', () => {
      expect(crossoverSchedule(oneDivisionSet)).to.eql([]);
    });

    describe('given 2 divisions', () => {
      let schedule: Game[] | null = null; // Explicitly type schedule

      beforeEach(() => {
        schedule = crossoverSchedule(twoDivisionsSet);
      });

      it('generates the correct schedule', () => {
        expect(schedule).to.eql(twoDivisionScheduleResult);
      });
    });

    it('given 3 divisions, returns four games', () => {
      expect(crossoverSchedule(threeDivisionsSet).length).to.eq(4);
    });

    it('given 4 divisions, returns six games', () => {
      expect(crossoverSchedule(fourDivisionsSet).length).to.eq(6);
    });
  });
});
