import suffix from '@lib/helpers/suffix'; // Using path alias

interface Team {
  // Define based on expected structure, if known, otherwise use 'any'
  [key: string]: any;
}

interface Division {
  length: number;
  // Add other properties if divisions are more complex than arrays of teams
  [index: number]: Team[]; // Assuming divisions are arrays of arrays of teams or similar
}

interface Game {
  id?: string;
  teams: string[];
}

const calculateNumCrossoverGames = (numOfDivisions: number): number => {
  return (numOfDivisions - 1) * 2;
};

export default (divisions: Division[]): Game[] => {
  if (arguments.length === 0) {
    throw new Error(
      'You must provide divisions to generate the crossover games',
    );
  }

  const crossOverGames: Game[] = [];
  const numOfDivisions = divisions.length;

  if (numOfDivisions > 1) {
    const numCrossoverGames = calculateNumCrossoverGames(numOfDivisions);

    for (let i = 0; i < numCrossoverGames; i++) {
      crossOverGames[i] = { teams: [] };
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
