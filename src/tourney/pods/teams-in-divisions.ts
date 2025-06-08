import _ from 'underscore';
import roundRobin from '../round-robin'; // Adjusted path
import suffix from '@lib/helpers/suffix'; // Used path alias

type TeamName = string; // e.g., "1st Pod 1"

interface PodsInput {
  [key: string]: TeamName[]; // Pods are objects with keys (pod numbers/IDs) and arrays of team names
}

const generateDivisions = (
  numOfDivisions: number,
  numPods: number,
  pods: PodsInput,
): TeamName[][] => {
  const divisions: TeamName[][] = [];

  for (let i = 0; i < numOfDivisions; i++) {
    divisions[i] = [];
  }

  for (let podNum = 1; podNum <= numPods; podNum++) {
    // Assuming pod keys are strings like "1", "2", etc. or that they can be accessed via number.
    const podKey = String(podNum);
    const teamsInPod = pods[podKey];
    if (!teamsInPod) continue; // Skip if pod doesn't exist

    const numTeamsInPod = teamsInPod.length;

    for (let teamIdxInPod = 0; teamIdxInPod < numTeamsInPod; teamIdxInPod++) {
      // CoffeeScript was 1-indexed for teamNum (1..numTeamsPod)
      // TS is 0-indexed, so division index is teamIdxInPod
      if (divisions[teamIdxInPod]) {
        // Ensure division exists
        divisions[teamIdxInPod].push(
          `${teamIdxInPod + 1}${suffix(teamIdxInPod + 1)} Pod ${podKey}`,
        );
      }
    }
  }
  return divisions;
};

const combineTinyDivisions = (divisions: TeamName[][]): TeamName[][] => {
  if (divisions.length === 0) return divisions;

  const lastDivision = divisions.pop();
  if (!lastDivision) return divisions; // Should not happen if length > 0

  // If lastDivision has only one team and there are other divisions left, merge it.
  if (lastDivision.length === 1 && divisions.length > 0) {
    divisions[divisions.length - 1].push(lastDivision[0]);
  } else {
    // Otherwise, add it back.
    divisions.push(lastDivision);
  }
  return divisions; // Ensure it always returns the modified or original divisions array
};

export default (pods: PodsInput): TeamName[][] => {
  // Check if pods is undefined, null, or empty.
  // Similar to crossover-schedule, this mimics a runtime check.
  if (!pods || Object.keys(pods).length === 0) {
    return []; // Return empty array if pods is empty or invalid
  }

  let divisions: TeamName[][] = [];

  const podsArray: TeamName[][] = _(pods).values();
  const numPods: number = _(pods).keys().length;

  // Determine the number of divisions by the length of the largest pod
  const numOfDivisions: number = _(podsArray)
    .chain()
    .map((pod) => pod.length)
    .max()
    .value();

  // Check if numOfDivisions is -Infinity (empty podsArray) or if there's only one pod (no divisions needed)
  if (numOfDivisions !== -Infinity && numPods >= 2) {
    divisions = generateDivisions(numOfDivisions, numPods, pods);
    if (divisions.length > 0) {
      // only combine if there are divisions
      combineTinyDivisions(divisions);
    }
  }

  return divisions;
};
