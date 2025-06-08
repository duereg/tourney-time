import { expect } from '../spec-helper';
import getTeamNamesAndNumber from '@lib/tourney/team-names-and-number'; // Using path alias

// Define types for better clarity
type TeamName = number | string;
interface TeamInfo {
  teams: number;
  names: TeamName[];
}

describe('tourney/team-names-and-number', () => {
  describe('given null', () => {
    it('throws an error', () => { // Updated test description
      // The function, when given null, should throw an error.
      expect(() => getTeamNamesAndNumber(null as any)).to.throw(
        'You must provide either the number of teams or a list of team names'
      );
    });
  });

  describe('given number of teams', () => {
    it('returns generated names and number of teams for 1 team', () => {
      expect(getTeamNamesAndNumber(1)).to.eql({ teams: 1, names: [1] });
    });

    it('returns generated names and number of teams for 2 teams', () => {
      expect(getTeamNamesAndNumber(2)).to.eql({ teams: 2, names: [1, 2] });
    });
  });

  describe('given names of teams', () => {
    it('returns original names and number of teams', () => {
      expect(getTeamNamesAndNumber(['a', 'b'])).to.eql({
        teams: 2,
        names: ['a', 'b'],
      });
    });
  });
});
