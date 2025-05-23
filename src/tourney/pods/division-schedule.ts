import _ from 'underscore';
import roundRobin from '../round-robin'; // Assuming round-robin is in the parent directory
import { Game, Schedule } from '../../tourney-time'; // Adjust path as needed, define types

// Assuming divisions is an array of arrays of teams (e.g., string[][])
// And roundRobin returns a Schedule object.
// Need to define Team type if it's more complex than string.
type Team = string; // Placeholder, adjust if Team is an object

interface DivisionSchedule extends Schedule {
  division?: number;
}

export default (divisions: Team[][]): DivisionSchedule[] => {
  const divisionsSchedule: DivisionSchedule[] = [];

  divisions.forEach((teamsInDivision, index) => {
    const divisionSchedule: DivisionSchedule = roundRobin(teamsInDivision);
    divisionSchedule.division = index + 1;

    _(divisionSchedule.schedule).forEach((game: Game) => { // Assuming game is of type Game
      game.id = `Div ${index + 1} Game ${game.id}`;
    });

    divisionsSchedule.push(divisionSchedule);
  });

  return divisionsSchedule;
};
