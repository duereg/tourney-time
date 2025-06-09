import tourneyTypeSelector from './tourney/selector'; // Relative path
import playoffGamesCalculator from './playoffs/duel'; // Relative path
import timeNeededCalculator from './timing/standard'; // Relative path
import scheduleGenerator from './schedule/generator'; // Relative path

// Define interfaces for the options and the return type
// These could be expanded and made more precise as the library evolves.

/**
 * Represents a single game in a tournament schedule.
 */
export interface Game {
  /**
   * Unique identifier for the game. Can be a number or a string (e.g., "Pod 1 Game 10").
   */
  id: number | string;
  /**
   * The round number in which the game takes place.
   */
  round: number;
  /**
   * An array of teams participating in the game. Teams can be identified by numbers or names.
   */
  teams: (string | number)[];
  // Add other game properties if they exist
}

/**
 * Represents a schedule for a tournament or a phase of it (e.g., playoffs).
 */
export interface Schedule {
  /**
   * The type of tournament format (e.g., "round robin", "knockout", "pods").
   */
  type: string;
  /**
   * The total number of games in this schedule segment.
   */
  games: number;
  /**
   * Optional detailed schedule of games.
   * This is typically excluded from the top-level `tourneySchedule` and `playoffSchedule`
   * in the main function's result but is used internally.
   */
  schedule?: Game[];
  /**
   * The number of playing areas used or allocated for this schedule segment.
   * This can be part of `tourneySchedule` and might be adjusted by the scheduling logic.
   */
  areas?: number;
  /**
   * Allows for additional properties that might be specific to certain schedule types,
   * such as pod details or division information.
   */
  [key: string]: any; // Allow other properties for now
}

/**
 * Options for calculating tournament time and generating schedules.
 */
export interface TourneyTimeOptions {
  /**
   * The total number of teams participating.
   */
  teams: number;
  /**
   * The duration of each regular tournament game in minutes.
   * @default 33
   */
  gameTime?: number;
  /**
   * The duration of rest time between regular tournament games in minutes.
   * @default 7
   */
  restTime?: number;
  /**
   * The number of available playing areas.
   * @default 1
   */
  areas?: number;
  /**
   * The duration of each playoff game in minutes.
   * @default 33
   */
  playoffTime?: number;
  /**
   * The duration of rest time between playoff games in minutes.
   * @default 12
   */
  playoffRestTime?: number;
  /**
   * Allows for other properties, often passed through from command-line arguments or other sources.
   */
  [key: string]: any;
}

/**
 * The result object returned by the main tourney-time calculation function.
 */
export interface TourneyTimeResult {
  /**
   * Summary of the main tournament schedule (type, games, areas), excluding detailed game list.
   */
  tourneySchedule: Schedule;
  /**
   * Summary of the playoff schedule (type, games), excluding detailed game list.
   */
  playoffSchedule: Schedule;
  /**
   * The total estimated time needed for the entire tournament in minutes.
   */
  timeNeededMinutes: number;
  /**
   * The complete generated schedule of all games.
   * If multiple areas are used, this may be an array of arrays (games per area/round grouping).
   * If one area is used, this is a flat array of games.
   */
  schedule: Game[] | Game[][];
}

// Default values matching original yargs defaults in bin/tourney-time.coffee
const defaultOptions = {
  gameTime: 33,
  restTime: 7,
  areas: 1,
  playoffTime: 33,
  playoffRestTime: 12,
};

export default (options: TourneyTimeOptions): TourneyTimeResult => {
  const opts = { ...defaultOptions, ...options };

  if (opts.teams < 2) {
    throw new Error('You must have at least two teams to continue');
  }

  // Ensure areas is at least 1, as some calculations might divide by it or expect it to be positive.
  // selector also has logic to adjust areas, this is a safeguard.
  const areas = Math.max(1, opts.areas || 1);

  const tourneyScheduleResult = tourneyTypeSelector(opts.teams, areas);
  const playoffScheduleResult = playoffGamesCalculator(opts.teams);

  const timeNeeded = timeNeededCalculator({
    tourneyGames: tourneyScheduleResult.games,
    playoffGames: playoffScheduleResult.games,
    gameTime: opts.gameTime,
    restTime: opts.restTime,
    areas: tourneyScheduleResult.areas, // Use areas from tourneySchedule, as it might have been adjusted
    playoffTime: opts.playoffTime,
    playoffRest: opts.playoffRestTime,
  });

  // scheduleGenerator expects tourneySchedule and playoffSchedule to have their .schedule property
  // The current types define it as optional. We need to ensure they are present if generator needs them.
  // Based on selector and duel, they do fill the .schedule property.
  const generatedSchedule = scheduleGenerator({
    tourneySchedule: tourneyScheduleResult, // Pass the full result which should include .schedule
    playoffSchedule: playoffScheduleResult, // Pass the full result
    areas: tourneyScheduleResult.areas, // Use adjusted areas
  });

  // Create objects for the return value, excluding the detailed schedules from these top-level objects
  const finalTourneySchedule: Schedule = { ...tourneyScheduleResult };
  delete finalTourneySchedule.schedule;

  const finalPlayoffSchedule: Schedule = { ...playoffScheduleResult };
  delete finalPlayoffSchedule.schedule;

  return {
    tourneySchedule: finalTourneySchedule,
    playoffSchedule: finalPlayoffSchedule,
    timeNeededMinutes: timeNeeded,
    schedule: generatedSchedule,
  };
};
