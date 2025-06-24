import {
  Schedule as TourneySchedule,
  Schedule as PlayoffSchedule,
  Game,
} from '../tourney-time'; // Assuming types are defined

interface SingleOptions {
  tourneySchedule?: TourneySchedule;
  playoffSchedule?: PlayoffSchedule;
}

export default ({
  tourneySchedule,
  playoffSchedule,
}: SingleOptions): Game[] => {
  if (!tourneySchedule) {
    throw new Error('You must provide a tournament schedule to continue');
  }
  if (!playoffSchedule) {
    throw new Error('You must provide a playoff schedule to continue');
  }

  let initialGames: Game[] = [];

  if (tourneySchedule.schedule) {
    initialGames = initialGames.concat(tourneySchedule.schedule.map(game => ({ ...game })));
  }

  if (playoffSchedule.schedule) {
    initialGames = initialGames.concat(playoffSchedule.schedule.map(game => ({ ...game })));
  }

  // Annotate for back-to-back games
  // This logic is taken from the former annotateBackToBackGames function for Game[]
  if (initialGames.length < 2) {
    return initialGames; // Not enough games for a back-to-back
  }

  // Iterate from the second game to check against the previous one
  for (let i = 1; i < initialGames.length; i++) {
    const previousGame = initialGames[i - 1];
    const currentGame = initialGames[i];

    if (previousGame.teams && Array.isArray(previousGame.teams) &&
        currentGame.teams && Array.isArray(currentGame.teams)) {
      const commonTeams = currentGame.teams.filter((team) =>
        previousGame.teams.includes(team),
      );
      if (commonTeams.length > 0) {
        // Directly annotate the currentGame object (which is a clone)
        currentGame.backToBackTeams = commonTeams;
      }
    }
  }

  return initialGames; // Return the (potentially) annotated schedule
};
