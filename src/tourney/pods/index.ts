import _ from 'underscore';
import roundRobin from '../round-robin'; // Adjusted path
import getTeamNamesAndNumber from '../team-names-and-number'; // Adjusted path
import generatePods from './teams-in-pods';
import generateDivisions from './teams-in-divisions';
import generateDivisionSchedule from './division-schedule';
import generatePodSchedule from './pod-schedule';
import generateCrossoverSchedule from './crossover-schedule';
import { Game, Schedule } from '../../tourney-time'; // Adjust path as needed, define types

// Define Team type if it's more complex than string
type Team = string;

interface TeamNamesAndNumberReturn {
  teams: number;
  names: Team[]; // Assuming names is an array of Team
}

interface PodsReturn {
  // Define based on what generatePods returns
  [key: string]: any; // Placeholder
}

type DivisionsReturn = string[][]; // Corrected type for what generateDivisions returns

interface ScheduleSection {
  title: string; // Added as per plan
  games: number;
  schedule: Game[]; // Ensure Game is the global type from tourney-time
  type?: string; // Added as per plan
  // Add other properties if they exist, or remove this comment
}

const sumGames = (schedule: ScheduleSection[]): number => {
  return _(schedule).reduce((memo, div) => memo + div.games, 0);
};

const spreadSchedule = (schedule: ScheduleSection[]): Game[] => {
  return _(schedule)
    .chain()
    .map((section) => section.schedule)
    .flatten()
    .sortBy((game) => game.round) // Assuming Game has a round property
    .value();
};

// The original CoffeeScript used `arguments` which is not directly available in the same way in TS arrow functions
// or when destructuring. Assuming `teams` was the primary first argument.
// If other arguments were expected, this function signature and logic might need adjustment.
export default (
  teamsArg: Team[] | number | { [key: string]: any },
): {
  // Loosening type for teamsArg
  games: number;
  schedule: Game[];
  divisions: DivisionsReturn;
  pods: PodsReturn;
} => {
  const { teams, names }: TeamNamesAndNumberReturn = getTeamNamesAndNumber(
    teamsArg as any,
  ); // Cast to any to satisfy getTeamNamesAndNumber

  if (teams < 2) {
    // For 0 or 1 team, pod structure is minimal or empty, no meaningful games.
    // generatePods with 1 name and teamsInPods=1 (or any number) should produce {'1': [name]}
    // If teamsInPods is fixed (e.g. 4), generatePods([name], 4) -> {'1': [name]}
    // The tests for pods(0) and pods(1) expect specific structures.
    // pods(0) -> { games: 0, schedule: [], divisions: [], pods: {} }
    // pods(1) -> (from test output) was erroring at crossover, but implies pods were generated.
    // Let's align with test expectations after sub-functions are robust.
    // For now, a simple guard:
    const defaultPods = teams === 1 ? generatePods(names, 1) : {}; // generatePods should handle names=[]
    return {
      games: 0,
      schedule: [],
      divisions: [],
      pods: defaultPods,
    };
  }

  // How should you calculate how many pods you should have?
  const teamsInPods = 4;
  const numOfPods = Math.floor(teams / teamsInPods);

  // returns teams in groups of four on object
  const pods: PodsReturn = generatePods(names, teamsInPods);
  const divisions: DivisionsReturn = generateDivisions(pods);

  const podSchedule: ScheduleSection[] = generatePodSchedule(pods);
  const divisionSchedule: ScheduleSection[] =
    generateDivisionSchedule(divisions);
  const crossoverSchedule: Game[] = generateCrossoverSchedule(divisions);

  const podGames = sumGames(podSchedule); // a bunch of mini round robins to determine divisions
  const divisionGames = sumGames(divisionSchedule); // round robins amongst the divisions
  const crossOverGames = crossoverSchedule.length; // cross over games (top of lower division plays bottom of division above)

  const spreadPodSchedule = spreadSchedule(podSchedule);
  const spreadDivisionSchedule = spreadSchedule(divisionSchedule);

  const totalGames = podGames + divisionGames + crossOverGames;

  const finalSchedule = spreadPodSchedule.concat(
    spreadDivisionSchedule,
    crossoverSchedule,
  );

  return { games: totalGames, schedule: finalSchedule, divisions, pods };
};
