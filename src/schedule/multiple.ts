import {
  Schedule as TourneySchedule,
  Schedule as PlayoffSchedule,
  Game,
} from '../tourney-time'; // Assuming types are defined

// Helper function to get teams playing in the last games of the previous round
const getTeamsInLastGames = (
  balancedSchedule: Game[][],
  areas: number,
): (string | number)[] => {
  if (balancedSchedule.length === 0) {
    return [];
  }

  const lastRoundGames = balancedSchedule[balancedSchedule.length - 1];
  const teamsInLastGames: (string | number)[] = [];

  // Get games from the end of the last round, up to 'areas' number of games
  const gamesToCheck = lastRoundGames.slice(-areas);

  for (const game of gamesToCheck) {
    if (game.teams) {
      teamsInLastGames.push(...game.teams);
    }
  }
  return teamsInLastGames;
};

interface ScheduleBalancerInput {
  schedule: Game[];
  // Add other properties if they exist on thingToSchedule
}

const scheduleBalancer = (
  thingToSchedule: ScheduleBalancerInput,
  areas: number,
): Game[][] => {
  const balancedSchedule: Game[][] = [];
  const schedule = [...thingToSchedule.schedule]; // Create a mutable copy

  for (let i = 0; i < schedule.length; i++) {
    let game = schedule[i];

    // Check for back-to-back conflict if this game starts a new logical round
    let previousBlockActualRound = 0;
    if (balancedSchedule.length > 0 && balancedSchedule[balancedSchedule.length - 1].length > 0) {
      previousBlockActualRound = balancedSchedule[balancedSchedule.length - 1][0].round;
    }

    if (balancedSchedule.length > 0 && game.round > previousBlockActualRound) {
      const teamsInLastGames = getTeamsInLastGames(balancedSchedule, areas);
      const currentBlockTeams = Array.isArray(game.teams) ? game.teams : [];
      const conflict = currentBlockTeams.some(team => teamsInLastGames.includes(team));

      if (conflict) {
        // let swapped = false; // Not strictly needed if 'game' is reassigned
        for (let j = i + 1; j < schedule.length; j++) {
          if (schedule[j].round === game.round) {
            const potentialSwapTeams = Array.isArray(schedule[j].teams) ? schedule[j].teams : [];
            const swapConflictWithLastGames = potentialSwapTeams.some(team => teamsInLastGames.includes(team));

            const teamsInCurrentNewBlock: (string | number)[] = []; // Will be empty as this is for the first game of a new round
            // This logic for teamsInCurrentNewBlock applies if we were already building the new round's first block.
            // However, 'game' is the *first* game of the new round being considered here.
            // So, the current new block is conceptually empty for this check.
            // The check against teamsInCurrentNewBlock is more for preventing a swap from introducing
            // a same-block conflict if the new round's block already had games.
            // For the first game of a new round, this will effectively be an empty check.
            // (No, this was subtly wrong, see refined logic below)

            // Corrected check for teamsInCurrentNewBlock:
            // We are trying to place 'game'. If we swap it with 'schedule[j]',
            // 'schedule[j]' would be placed. 'teamsInCurrentNewBlock' should be teams
            // *already placed in the block where schedule[j] would go*.
            // Since schedule[j] would be the *first* game in that block (as game is first of new round),
            // teamsInCurrentNewBlock for schedule[j]'s placement check is effectively empty.
            // The existing logic for swapConflictWithCurrentBlock is fine.

            const swapConflictWithCurrentBlock = potentialSwapTeams.some(team => teamsInCurrentNewBlock.includes(team));


            if (!swapConflictWithLastGames && !swapConflictWithCurrentBlock) {
              [schedule[i], schedule[j]] = [schedule[j], schedule[i]];
              game = schedule[i]; // game is now the swapped game
              // swapped = true;
              break;
            }
          }
        }
      }
    }

    // Game placement logic
    if (balancedSchedule.length === 0) {
      balancedSchedule.push([game]);
    } else {
      const currentProcessingBlock = balancedSchedule[balancedSchedule.length - 1];
      if (currentProcessingBlock.length === 0) { // Should not happen if previous logic is correct
        currentProcessingBlock.push(game); // Start new block if somehow empty
      } else if (currentProcessingBlock.length < areas && currentProcessingBlock[0].round === game.round) {
        // Check for team conflict within the currentProcessingBlock
        const teamsInCurrentProcessingBlock: (string | number)[] = [];
        for (const g of currentProcessingBlock) {
          if (g.teams) teamsInCurrentProcessingBlock.push(...g.teams);
        }
        const gameTeams = Array.isArray(game.teams) ? game.teams : [];
        const hasConflictInBlock = gameTeams.some(team => teamsInCurrentProcessingBlock.includes(team));

        if (hasConflictInBlock) {
          balancedSchedule.push([game]); // New block due to team conflict
        } else {
          currentProcessingBlock.push(game); // Append to current block
        }
      } else {
        // New block if:
        // 1. Current block is full (currentProcessingBlock.length === areas)
        // 2. Game is for a new round (currentProcessingBlock[0].round !== game.round)
        balancedSchedule.push([game]);
      }
    }
  }
  return balancedSchedule;
};

export interface MultipleOptions {
  tourneySchedule?: TourneySchedule;
  playoffSchedule?: PlayoffSchedule;
  areas: number;
}

export default ({
  tourneySchedule,
  playoffSchedule,
  areas,
}: MultipleOptions): Game[][] => {
  if (!tourneySchedule) {
    throw new Error('You must provide a tournament schedule to continue');
  }
  if (!playoffSchedule) {
    throw new Error('You must provide a playoff schedule to continue');
  }

  let balancedSchedule: Game[][] = [];

  // Pass an object conforming to ScheduleBalancerInput,
  // providing an empty array if the schedule property is undefined.
  balancedSchedule = scheduleBalancer(
    { schedule: tourneySchedule.schedule || [] },
    areas,
  );

  balancedSchedule = balancedSchedule.concat(
    scheduleBalancer({ schedule: playoffSchedule.schedule || [] }, areas),
  );

  return balancedSchedule;
};
