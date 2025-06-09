import roundRobin from './round-robin'; // Relative path
import pods from './pods'; // Relative path
import { Game } from '../tourney-time'; // Adjust path as needed for types

interface TourneyResultBase {
  games: number;
  schedule: Game[];
  type: string;
  areas: number;
}

// Assuming roundRobin and pods return types that include games, schedule, and potentially a type string.
// Let's define a common structure for what they might return, compatible with TourneyResultBase.
interface SchedulingFunctionResult {
  games: number;
  schedule: Game[];
  // type might not be directly returned by roundRobin or pods, but set by selector
}

export default (teams: number, areas: number): TourneyResultBase => {
  let tourney: SchedulingFunctionResult;
  let type: string;

  // The condition for using pods:
  // More than 8 teams AND areas available are less than or equal to a quarter of the teams (rounded down).
  if (teams > 8 && areas <= Math.floor(teams / 4)) {
    tourney = pods(teams); // pods function likely takes the number of teams
    type = 'pods';
  } else {
    tourney = roundRobin(teams); // roundRobin function takes the number of teams
    type = 'round robin';

    // For round robin, there's a practical limit to how many areas can be effectively used.
    // This limit is typically half the number of teams (since each game involves 2 teams).
    // If more areas are specified than this limit, reduce the number of areas.
    const areaLimit = Math.floor(teams / 2);
    // Ensure areas is at least 1, even if areaLimit is 0 (e.g. for 1 team, though roundRobin handles 0/1 teams)
    if (areas > areaLimit && areaLimit > 0) {
      // Only cap if areaLimit is meaningful
      areas = areaLimit;
    } else if (areaLimit === 0 && teams > 1) {
      // e.g. 1 team, areaLimit is 0. If areas was 0, make it 1.
      areas = 1;
    } else if (areas === 0 && teams > 1) {
      // if areas was passed as 0
      areas = 1;
    }
    // If teams <=1, roundRobin will return 0 games, areas can be 1.
    if (teams <= 1 && areas === 0) areas = 1;
    // If only 0 or 1 team, number of areas should effectively be 1,
    // as there are no parallel games.
    if (teams <= 1) areas = 1;
  }

  return {
    type,
    games: tourney.games,
    schedule: tourney.schedule,
    areas,
  };
};
