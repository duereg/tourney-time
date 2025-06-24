import { Game } from '../../tourney-time';

// Helper function to annotate games with back-to-back team information
export const annotateBackToBackGames = (
  inputScheduleData: Game[] | Game[][],
): Game[] | Game[][] => {
  // Deep clone to avoid mutating original props, especially important if state is managed elsewhere
  const processedScheduleData = JSON.parse(JSON.stringify(inputScheduleData));

  if (
    !processedScheduleData ||
    processedScheduleData.length === 0
  ) {
    return processedScheduleData;
  }

  // Case 1: Schedule is Game[] (single area or already flattened)
  if (!Array.isArray(processedScheduleData[0])) {
    const games = processedScheduleData as Game[];
    if (games.length < 2) return games;

    for (let i = 1; i < games.length; i++) {
      const previousGame = games[i - 1];
      const currentGame = games[i];

      // Ensure teams are defined and are arrays before attempting to filter/include
      if (previousGame.teams && Array.isArray(previousGame.teams) &&
          currentGame.teams && Array.isArray(currentGame.teams)) {
        const commonTeams = currentGame.teams.filter((team) =>
          previousGame.teams.includes(team),
        );
        if (commonTeams.length > 0) {
          currentGame.backToBackTeams = commonTeams;
        }
      }
    }
    return games;
  }

  // Case 2: Schedule is Game[][] (multiple areas, structured as blocks of concurrent games)
  const gameBlocks = processedScheduleData as Game[][];
  if (gameBlocks.length < 2) return gameBlocks; // Not enough blocks for a back-to-back

  for (let i = 1; i < gameBlocks.length; i++) {
    const previousBlockGames = gameBlocks[i - 1];
    const currentBlockGames = gameBlocks[i];

    if (!previousBlockGames || !currentBlockGames) continue;

    const teamsInPreviousBlock = previousBlockGames.flatMap(
      (game) => (game.teams && Array.isArray(game.teams) ? game.teams : []),
    );

    if (teamsInPreviousBlock.length === 0) continue;

    for (const game of currentBlockGames) {
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
  return gameBlocks;
};
