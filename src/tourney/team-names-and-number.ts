// Define TeamName as a generic type T, which can be number or string
type TeamNameType = number | string;

interface TeamInfo<T extends TeamNameType = TeamNameType> {
  names: T[];
  teams: number;
}

// The function can accept a number (count of teams) or an array of team names.
export default <T extends TeamNameType>(
  teamsOrNames: number | T[] | null | undefined,
): TeamInfo<T> => {
  // Handle the case where the input is null or undefined (no arguments passed in CoffeeScript)
  if (teamsOrNames === null || teamsOrNames === undefined) {
    throw new Error(
      'You must provide either the number of teams or a list of team names',
    );
  }

  let names: T[] = [];
  let teamCount: number;

  if (typeof teamsOrNames === 'number') {
    teamCount = teamsOrNames;
    if (teamCount < 0) teamCount = 0; // Or throw error for negative numbers
    // Generate names as numbers from 1 to teamCount
    for (let i = 1; i <= teamCount; i++) {
      names.push(i as T); // Cast 'i' to T, assuming T can be number
    }
  } else if (Array.isArray(teamsOrNames)) {
    // If it's an array, these are the names.
    names = teamsOrNames;
    teamCount = teamsOrNames.length;
  } else {
    // Should not happen if input is number | T[] | null | undefined, but as a fallback:
    teamCount = 0;
    names = [];
  }

  return { names, teams: teamCount };
};
