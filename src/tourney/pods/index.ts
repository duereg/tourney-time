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

interface DivisionsReturn {
  // Define based on what generateDivisions returns
  [key: string]: any; // Placeholder
}

interface ScheduleSection {
  games: number;
  schedule: Game[];
  // Add other properties if they exist
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
export default (teamsArg: Team[] | number | { [key: string]: any }): { // Loosening type for teamsArg
  games: number;
  schedule: Game[];
  divisions: DivisionsReturn;
  pods: PodsReturn;
} => {
  const { teams, names }: TeamNamesAndNumberReturn = getTeamNamesAndNumber(teamsArg as any); // Cast to any to satisfy getTeamNamesAndNumber

  // How should you calculate how many pods you should have?
  const teamsInPods = 4;
  const numOfPods = Math.floor(teams / teamsInPods);

  // returns teams in groups of four on object
  const pods: PodsReturn = generatePods(names, teamsInPods);
  const divisions: DivisionsReturn = generateDivisions(pods);

  const podSchedule: ScheduleSection[] = generatePodSchedule(pods);
  const divisionSchedule: ScheduleSection[] = generateDivisionSchedule(divisions);
  const crossoverSchedule: Game[] = generateCrossoverSchedule(divisions);

  const podGames = sumGames(podSchedule); // a bunch of mini round robins to determine divisions
  const divisionGames = sumGames(divisionSchedule); // round robins amongst the divisions
  const crossOverGames = crossoverSchedule.length; // cross over games (top of lower division plays bottom of division above)

  const spreadPodSchedule = spreadSchedule(podSchedule);
  const spreadDivisionSchedule = spreadSchedule(divisionSchedule);

  const totalGames = podGames + divisionGames + crossOverGames;

  const finalSchedule = spreadPodSchedule.concat(spreadDivisionSchedule, crossoverSchedule);

  return { games: totalGames, schedule: finalSchedule, divisions, pods };
};
