import suffix from '@lib/helpers/suffix'; // Using path alias
import { Game } from '../../tourney-time'; // Import global Game type

// interface Team can be removed if not used after Division interface is removed
// interface Division can be removed as we change parameter type to string[][]

const calculateNumCrossoverGames = (numOfDivisions: number): number => {
  return (numOfDivisions - 1) * 2;
};

// Changed parameter type from Division[] to string[][]
export default (divisions: string[][]): Game[] => {
  // Check if divisions is undefined, null, or empty.
  // Note: TypeScript's type system would ideally enforce that 'divisions' is always provided
  // unless its type is explicitly 'Division[] | undefined' or 'divisions?: Division[]'.
  // This check is to mimic the original CoffeeScript's runtime check.
  if (!divisions || divisions.length < 2) {
    // Crossover games only make sense with at least 2 divisions
    return []; // Return empty array if not enough divisions for crossover
  }

  const crossOverGames: Game[] = [];
  const numOfDivisions = divisions.length;

  if (numOfDivisions > 1) {
    const numCrossoverGames = calculateNumCrossoverGames(numOfDivisions);

    for (let i = 0; i < numCrossoverGames; i++) {
      // Initialize with round property and a temporary id
      crossOverGames[i] = { id: `crossover-${i}`, teams: [], round: 1 }; // Set round to 1
    }

    for (let divisionIdx = 1; divisionIdx < numOfDivisions; divisionIdx++) {
      const teamsInPreviousDivision = divisions[divisionIdx - 1].length; // division is 0-indexed
      const crossOverPosition = (divisionIdx - 1) * 2;

      const gameOne = crossOverGames[crossOverPosition];
      const gameTwo = crossOverGames[crossOverPosition + 1];

      gameOne.id = `Div ${divisionIdx}/${divisionIdx + 1} <-1->`; // divisionIdx is 1-based for display
      gameTwo.id = `Div ${divisionIdx}/${divisionIdx + 1} <-2->`;

      // Ensure suffix is called correctly
      gameOne.teams.push(
        `${teamsInPreviousDivision - 1}${suffix(teamsInPreviousDivision - 1)} Div ${divisionIdx}`,
      );
      gameOne.teams.push(`2nd Div ${divisionIdx + 1}`);

      gameTwo.teams.push(
        `${teamsInPreviousDivision}${suffix(teamsInPreviousDivision)} Div ${divisionIdx}`,
      );
      gameTwo.teams.push(`1st Div ${divisionIdx + 1}`);
    }
  }
  return crossOverGames;
};
