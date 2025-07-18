import {
  Schedule as TourneySchedule,
  Schedule as PlayoffSchedule,
  Game,
} from '../tourney-time'; // Assuming types are defined

interface ScheduleBalancerInput {
  schedule: Game[];
  // Add other properties if they exist on thingToSchedule
}

const scheduleBalancer = (
  thingToSchedule: ScheduleBalancerInput,
  areas: number,
): Game[][] => {
  const balancedSchedule: Game[][] = [];
  let currentRound = 1;

  for (const game of thingToSchedule.schedule) {
    if (balancedSchedule.length) {
      const round = balancedSchedule[balancedSchedule.length - 1];

      if (round.length < areas) {
        let teamsInRound: (string | number)[] = [];
        for (const r of round) {
          if (r.teams) { // Ensure r.teams exists
            teamsInRound = teamsInRound.concat(r.teams);
          }
        }
        // Ensure game.teams is an array before filtering
        const currentBlockTeams = Array.isArray(game.teams) ? game.teams : [];
        const commonTeams = teamsInRound.filter(team => currentBlockTeams.includes(team));
        const hasTeam = commonTeams.length > 0; // Corrected to boolean check

        // How bye matches (now included in thingToSchedule.schedule) are handled:
        // 1. Upstream changes (duel.js, round-robin.ts) ensure bye matches (with isByeMatch: true
        //    and the single team in game.teams) are part of the input schedule.
        // 2. This loop iterates over all games, including these bye matches.
        // 3. When a game (regular or bye) is added to `round` (the current scheduling block),
        //    its teams are effectively included in `teamsInRound` for the next iteration's check.
        // 4. If a bye match for 'Team A' is placed in the current block, 'Team A' is added to `teamsInRound`.
        // 5. If the immediately following game in `thingToSchedule.schedule` also involves 'Team A',
        //    the `hasTeam` condition (checking for common teams between the current game
        //    and `teamsInRound`) will become true.
        // 6. This (hasTeam === true) correctly triggers the creation of a new scheduling block
        //    (`balancedSchedule.push([game])`) for the game involving 'Team A'.
        // 7. This prevents 'Team A' from "playing" a regular game in the same scheduling block
        //    immediately after its bye match was scheduled in that block.
        // 8. Therefore, the existing conditional logic `if (hasTeam || currentRound !== game.round)`
        //    is sufficient to prevent back-to-back scheduling for a team after a bye,
        //    given the modified input data that now includes bye matches as distinct game objects.
        if (hasTeam || currentRound !== game.round) {
          balancedSchedule.push([{ ...game }]); // Clone game
        } else {
          round.push({ ...game }); // Clone game
        }
      } else {
        balancedSchedule.push([{ ...game }]); // Clone game
      }
    } else {
      balancedSchedule.push([{ ...game }]); // Clone game
    }
    currentRound = game.round;
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

  let finalBalancedSchedule: Game[][] = [];

  // Process tourney schedule
  // Ensure input to scheduleBalancer is also cloned if direct mutation of tourneySchedule.schedule is a concern.
  // However, scheduleBalancer now clones internally, so the original Game objects in tourneySchedule.schedule are not modified by it.
  const tourneyGamesInput = tourneySchedule.schedule ? tourneySchedule.schedule.map(g => ({...g})) : [];
  finalBalancedSchedule = scheduleBalancer(
    { schedule: tourneyGamesInput },
    areas,
  );

  // Process playoff schedule and concat
  const playoffGamesInput = playoffSchedule.schedule ? playoffSchedule.schedule.map(g => ({...g})) : [];
  finalBalancedSchedule = finalBalancedSchedule.concat(
    scheduleBalancer({ schedule: playoffGamesInput }, areas),
  );

  // Annotate for back-to-back games
  // This logic is taken from the former annotateBackToBackGames function for Game[][]
  if (finalBalancedSchedule.length < 2) {
    return finalBalancedSchedule; // Not enough blocks for a back-to-back
  }

  for (let i = 1; i < finalBalancedSchedule.length; i++) {
    const previousBlockGames = finalBalancedSchedule[i - 1];
    const currentBlockGames = finalBalancedSchedule[i];

    if (!previousBlockGames || !currentBlockGames) continue;

    const teamsInPreviousBlock = previousBlockGames.flatMap(
      (game) => (game.teams && Array.isArray(game.teams) ? game.teams : []),
    );

    if (teamsInPreviousBlock.length === 0) continue;

    for (const game of currentBlockGames) { // game is already a clone from scheduleBalancer
      if (game.teams && Array.isArray(game.teams)) {
        const commonTeams = game.teams.filter((team) =>
          teamsInPreviousBlock.includes(team),
        );
        if (commonTeams.length > 0) {
          game.backToBackTeams = commonTeams;
        }
      }
    }
  }

  return finalBalancedSchedule;
};
