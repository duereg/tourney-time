interface StandardTimingOptions {
  tourneyGames: number;
  playoffGames: number;
  gameTime: number;
  restTime: number;
  areas: number;
  playoffTime: number;
  playoffRest: number;
}

const calculateStandardTiming = ({
  tourneyGames,
  playoffGames,
  gameTime,
  restTime,
  areas,
  playoffTime,
  playoffRest,
}: StandardTimingOptions): number => {
  const calcAreaLength = (games: number): number => {
    return Math.floor(games / areas) + (games % areas);
  };

  const tourneyAreaLength = calcAreaLength(tourneyGames);
  const playoffAreaLength = calcAreaLength(playoffGames);

  return (
    tourneyAreaLength * (gameTime + restTime) +
    playoffAreaLength * (playoffTime + playoffRest)
  );
};

export default calculateStandardTiming;
