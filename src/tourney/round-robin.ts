import robinScheduleModule from 'roundrobin';
import { Game, TourneyTimeOptions } from '../tourney-time'; // Adjusted import

// Interface for the config object (matching original structure if possible)
interface RoundRobinConfig<T> {
  random?: (arr: T[]) => T[]; // Assuming a generic sort/random function
  maxByes?: number;
  autoByes?: boolean;
}

// Interface for the result (matching original structure if possible)
export interface RoundRobinResult<T> {
  schedule: Game[];
  games: number;
  teams: T[];
  type?: string;
}

function roundRobin<T extends string | number>(
  teams: number,
  names: T[] = [],
  sort = true, // Original default
  config?: RoundRobinConfig<T>,
): RoundRobinResult<T> {
  if (teams < 2) {
    let resolvedNames: T[];
    if (teams === 1) {
      // If names array is provided and matches length 1, use it. Otherwise, default.
      if (names.length === 1) {
        resolvedNames = names;
      } else {
        resolvedNames = [1] as any as T[]; // Default for roundRobin(1)
      }
    } else {
      // teams === 0
      resolvedNames = [];
    }
    return {
      schedule: [],
      games: 0,
      teams: resolvedNames,
      type: 'round robin',
    };
  }

  const actualNames =
    names.length === teams ? names : (Array.from({ length: teams }, (_, i) => i + 1) as any as T[]);

  type RoundRobinSchedulerType = (teams: number, names?: T[]) => T[][][];
  const actualScheduler = (robinScheduleModule as any).default as RoundRobinSchedulerType;
  // duereg/roundrobin returns T[][][] (rounds -> pairings -> teams)
  const rawSchedule: T[][][] = actualScheduler(teams, actualNames);

  // Map to Game objects - keeping types loose initially to replicate original issue
  const unflattenedSchedule: any[][] = rawSchedule.map(
    (round: T[][], rNumber: number) => {
      return round.map((matchup: T[], mNumber: number) => {
        // Ensure matchup has at least two teams for a valid game
        if (matchup && matchup.length >= 2) {
          return {
            id: `g${rNumber}-${mNumber}`, // Example ID
            round: rNumber + 1,
            teams: [matchup[0], matchup[1]], // Takes the first two teams
          };
        }
        return null; // Or handle incomplete matchups/byes appropriately
      });
    },
  );

  // Filter out nulls (from byes/incomplete matchups) and ensure round numbers
  const addedRounds: Game[][] = unflattenedSchedule.map(
    (round: any[], rNumber: number): Game[] => {
      const validGamesInRound = round.filter((game) => game !== null);
      return validGamesInRound.map((game: any): Game => {
        return {
          id:
            game.id ||
            `g${rNumber}-${game.teams && game.teams.join ? game.teams.join('') : Math.random()}`,
          round: rNumber + 1, // Set round number consistently
          teams: game.teams || [],
        } as Game; // Cast to Game
      });
    },
  );

  const scheduleFlat: Game[] = addedRounds.flat(1);

  // This is the line that often caused the TS2345 error (approx. line 47 in original)
  const games: number = scheduleFlat.length;

  // Sorting logic (simplified, assuming no custom sort from config for now to reduce complexity)
  // if (sort) {
  //   // Apply a default sort or shuffle if required by original logic
  //   // For now, let's use the unsorted schedule to see if base logic compiles
  // }

  return {
    schedule: scheduleFlat,
    games: games,
    teams: actualNames.slice(0, teams),
    type: 'round robin',
  };
}

export default roundRobin;
