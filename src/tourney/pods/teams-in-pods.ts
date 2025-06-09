import _ from 'underscore';

type TeamName = string;

interface TeamsInPodsResult {
  [podKey: string]: TeamName[];
}

export default (
  names: TeamName[],
  teamsInPodsCount: number,
): TeamsInPodsResult => {
  if (
    names === undefined ||
    teamsInPodsCount === undefined ||
    !Array.isArray(names)
  ) {
    throw new Error(
      'Invalid arguments for teamsInPods: required parameters are missing or invalid.',
    );
  }
  // The arguments.length check is typically handled by TypeScript's compile-time checks
  // based on the function signature. If 'names' or 'teamsInPodsCount' are undefined,
  // and they are not marked as optional or allowing undefined, TypeScript will error.
  // Assuming such checks are now part of the calling TypeScript code's responsibility.
  // If this function can be called from JS without these args, params should be optional.

  const teams = names.length;
  // In the original CoffeeScript, teamsInDivision was an intermediate calculation for numOfPods.
  // Let's stick to numOfPods for clarity regarding pods.
  const numOfPodsBase = Math.floor(teams / teamsInPodsCount);
  const leftOverTeams = teams % teamsInPodsCount;

  // The CoffeeScript _(names).groupBy logic distributes teams into pods.
  // If there are leftover teams, it creates numOfPodsBase + 1 "effective" pods for distribution.
  // Otherwise, it uses numOfPodsBase.
  const effectiveNumOfPods =
    leftOverTeams > 0 ? numOfPodsBase + 1 : numOfPodsBase;

  // Ensure effectiveNumOfPods is at least 1 to avoid issues with modulo by zero if names is empty
  // or teamsInPodsCount is greater than names.length.
  // Although, if names is empty, groupBy will return {} anyway.
  // If teamsInPodsCount is 0, it would lead to division by zero; needs guard or different logic.
  if (teamsInPodsCount <= 0) {
    // Or handle as an error, depending on desired behavior for invalid input.
    return {};
  }

  const teamsAssignedToPods: TeamsInPodsResult = _(names).groupBy(
    (name, index) => {
      if (effectiveNumOfPods === 0) return '1'; // Avoid modulo by zero, put all in pod '1' if no pods
      return String(Math.floor(index % effectiveNumOfPods) + 1); // Pod keys are "1", "2", ...
    },
  );

  // The previous logic in CoffeeScript for `teamsInPods = _(names).groupBy ...` directly returns
  // the object where keys are pod numbers (1-indexed) and values are arrays of names.
  // The variable name `teamsInPods` in the original script for the result was a bit confusing.
  // Renaming to `teamsAssignedToPods` for clarity.

  return teamsAssignedToPods;
};
