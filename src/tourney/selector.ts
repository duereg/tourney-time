import roundRobin from './round-robin';
import pods from './pods';
import partialRoundRobin from './partial-round-robin';
import { Game, SchedulingStrategy } from '../tourney-time'; // Assuming SchedulingStrategy is here

// TourneyResultBase is the expected return structure for the selector
export interface TourneyResultBase { // Exporting for use in tests if needed
  games: number;
  schedule: Game[];
  type: string;
  areas: number;
  [key: string]: any; // To accommodate other properties like 'divisions', 'pods' from pods result
}

// Interface for the result from any scheduling function (roundRobin, pods, partialRoundRobin)
// They all should return at least games and schedule. 'type' is added by the selector.
interface SchedulingFunctionResult {
  games: number;
  schedule: Game[];
  [key: string]: any; // Pods returns more, roundRobin might too (e.g. 'teams' array)
}

interface SelectorOptions {
  teams: number;
  areas: number;
  strategy?: SchedulingStrategy; // Optional: if not provided, could default or use old logic
  numGamesPerTeam?: number;
  teamNames?: (string | number)[]; // Optional, for passing names to schedulers
}

export default (options: SelectorOptions): TourneyResultBase => {
  const {
    teams,
    areas: initialAreas, // Rename to avoid conflict with adjusted areas
    strategy = 'round-robin', // Default strategy if none provided
    numGamesPerTeam = 0, // Default if not applicable or provided
    teamNames = [],
  } = options;

  let tourney: SchedulingFunctionResult;
  let type: string;
  let adjustedAreas = initialAreas; // Use this for area adjustments

  switch (strategy) {
    case 'pods':
      if (teams < 2) { // Pods makes no sense for < 2 teams, default to RR behavior
        tourney = roundRobin(teams, teamNames);
        type = 'round robin'; // Or handle as an error/empty schedule specifically
      } else {
        tourney = pods(teams); // Assuming pods handles names if necessary, or can be modified
        type = 'pods';
      }
      break;
    case 'partial-round-robin':
      if (numGamesPerTeam <= 0 && teams >=2) {
        // Default to full round robin if numGamesPerTeam is invalid for partial
        console.warn("Invalid numGamesPerTeam for partial-round-robin, defaulting to full round-robin.");
        tourney = roundRobin(teams, teamNames);
        type = 'round robin';
      } else {
        tourney = partialRoundRobin(teams, numGamesPerTeam, teamNames);
        type = 'partial round robin';
      }
      break;
    case 'round-robin':
    default: // Default to round-robin
      tourney = roundRobin(teams, teamNames);
      type = 'round robin';
      break;
  }

  // Area adjustment logic (mostly for round robin, but can be general)
  // For round robin (full or partial), there's a practical limit to how many areas can be effectively used.
  // This limit is typically half the number of teams (since each game involves 2 teams).
  if (type === 'round robin' || type === 'partial round robin') {
    const areaLimit = Math.max(1, Math.floor(teams / 2)); // Ensure areaLimit is at least 1 if teams > 0
    if (teams <= 1) { // 0 or 1 team
        adjustedAreas = 1;
    } else if (initialAreas > areaLimit) {
      adjustedAreas = areaLimit;
    } else if (initialAreas <= 0) { // Ensure at least one area if not 0/1 team
        adjustedAreas = 1;
    }
  }
  // For pods, area logic might be different or handled internally by pods/generator.
  // The old selector logic had a condition for pods: `areas <= Math.floor(teams / 4)`.
  // This explicit strategy selection makes that less relevant here, but worth noting.
  // If areas for pods needs specific handling, it should be added here or in schedule/generator.

  return {
    ...tourney, // Spread all properties from the scheduling function result
    type,
    games: tourney.games,
    schedule: tourney.schedule,
    areas: adjustedAreas,
  };
};
