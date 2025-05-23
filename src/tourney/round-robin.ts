import _ from 'underscore';
// The 'roundrobin' package is a JS module. It might not have default typings.
// We'll import it and assume it works as expected.
// If type errors arise later, we might need to add a declaration file or find @types/roundrobin.
import robinSchedule from 'roundrobin';

import getTeamNamesAndNumber from './team-names-and-number'; // Relative path to sibling module
import { Game } from '../tourney-time'; // Assuming Game type is defined in tourney-time.ts

// Define the expected structure of the schedule from the 'roundrobin' package
// This is an assumption based on the CoffeeScript code's usage.
// Each element in the outer array is a round, containing pairs of teams.
type RobinScheduleInput = (string | number)[]; // Team names or numbers
type RobinScheduleOutput = (string | number)[][][]; // Array of rounds, each round is an array of games (team pairs)

interface TeamInfo<T = string | number> {
  teams: number;
  names: T[];
}

interface RoundRobinResult<T = string | number> {
  games: number;
  schedule: Game[];
  teams: T[];
}

// The original CoffeeScript used `arguments` which isn't directly available in the same way in TS arrow functions
// or when destructuring. Assuming `teamsOrNames` was the primary first argument.
export default <T extends string | number>(
  teamsOrNames: T[] | number,
): RoundRobinResult<T> => {
  // The `getTeamNamesAndNumber` function expects a single argument,
  // which can be a number or an array of names.
  const { teams, names }: TeamInfo<T> = getTeamNamesAndNumber(
    teamsOrNames as any,
  ); // Use 'as any' to satisfy the flexible input

  // `robinSchedule` from the 'roundrobin' package likely expects the number of teams or an array of names.
  // The CoffeeScript passed `teams` (number) and `names` (array) as separate arguments.
  // Let's check the 'roundrobin' package documentation if it was specific.
  // Common usage for such libraries is often just `robinSchedule(teams)` or `robinSchedule(namesArray)`.
  // The original CoffeeScript `robinSchedule(teams, names)` is unusual.
  // A quick search for 'npm roundrobin' shows a package by 'clux' where `roundrobin(n, [names])` is the signature.
  // So, the CoffeeScript was likely correct in its usage.
  const unflattenedSchedule: RobinScheduleOutput = robinSchedule(
    teams,
    names as any[],
  );

  const addedRounds: Game[][] = _(unflattenedSchedule).map(
    (round: (string | number)[][], roundIndex: number) => {
      return _(round).map(
        (teamPair: (string | number)[], gameIndex: number): Game => {
          const daRound = roundIndex + 1;
          return {
            teams: teamPair as T[], // Cast teamPair to T[]
            round: daRound,
            id: parseInt(daRound.toString() + gameIndex.toString(), 10), // Ensure radix 10
          };
        },
      );
    },
  );

  const schedule: Game[] = _(addedRounds).flatten(true);
  const games = schedule.length;

  return { games, schedule, teams: names };
};
