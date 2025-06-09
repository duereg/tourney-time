import _ from 'underscore';
import roundRobin from '../round-robin'; // Assuming round-robin is in the parent directory
import { Game, Schedule } from '../../tourney-time'; // Adjust path as needed, define types

// Assuming divisions is an array of arrays of teams (e.g., string[][])
// And roundRobin returns a Schedule object.
// Need to define Team type if it's more complex than string.
type Team = string; // Placeholder, adjust if Team is an object

interface DivisionSchedule extends Schedule {
  title: string; // Added title
  division?: number;
  schedule: Game[]; // Ensured non-optional
  teams: Team[]; // Added teams from rrResult
}

export default (divisions: Team[][]): DivisionSchedule[] => {
  const divisionsSchedule: DivisionSchedule[] = [];

  divisions.forEach((teamsInDivision, index) => {
    // Pass team count as first arg, then names array. Assuming sort=false.
    const rrResult = roundRobin<Team>(teamsInDivision.length, teamsInDivision, false);
    const divisionSchedule: DivisionSchedule = {
      // games, teams, schedule are from rrResult
      // type is from global Schedule, but we make it specific 'division'
      ...rrResult,
      title: `Division ${index + 1}`, // Added title
      type: 'division',
      division: index + 1,
      schedule: rrResult.schedule || [],
    };

    _(divisionSchedule.schedule).forEach((game: Game) => {
      // Assuming game is of type Game
      game.id = `Div ${index + 1} Game ${game.id}`;
    });

    divisionsSchedule.push(divisionSchedule);
  });

  return divisionsSchedule;
};
