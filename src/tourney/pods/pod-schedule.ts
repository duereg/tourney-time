import _ from 'underscore';
import roundRobin from '../round-robin'; // Adjusted path
import { Game, Schedule } from '../../tourney-time'; // Adjust path as needed, define types

// Assuming pods is an object where keys are pod identifiers (string)
// and values are arrays of teams (e.g., string[]).
// roundRobin returns a Schedule object.
// Need to define Team type if it's more complex than string.
type Team = string; // Placeholder, adjust if Team is an object

interface PodSchedule extends Schedule {
  title: string; // Added title
  pod?: string;
  schedule: Game[]; // Ensured non-optional
  teams: Team[]; // Added teams from rrResult
}

interface PodsInput {
  [key: string]: Team[];
}

export default (pods: PodsInput): PodSchedule[] => {
  const podsSchedule: PodSchedule[] = [];

  for (const key in pods) {
    if (Object.prototype.hasOwnProperty.call(pods, key)) {
      const teamsInPod = pods[key];
      // Pass team count as first arg, then names array. Assuming sort=false.
      const rrResult = roundRobin<Team>(teamsInPod.length, teamsInPod, false);
      const podScheduleResult: PodSchedule = {
        // games, teams, schedule are from rrResult
        // type is from global Schedule, but we make it specific 'pod'
        ...rrResult,
        title: `Pod ${key}`, // Added title
        type: 'pod',
        pod: key,
        schedule: rrResult.schedule || [],
      };

      _(podScheduleResult.schedule).forEach((game: Game) => {
        // Assuming game is of type Game
        game.id = `Pod ${key} Game ${game.id}`;
      });

      podsSchedule.push(podScheduleResult);
    }
  }

  return podsSchedule;
};
