import { Game } from '../tourney-time';
import { RoundRobinResult } from './round-robin';
import roundrobinImported from 'roundrobin';

/**
 * Generates a partial round robin schedule.
 * Each team plays approximately `numGamesToPlay` games.
 *
 * @param teams The total number of teams.
 * @param numGamesToPlay The target number of games for each team.
 * @param names Optional array of team names. If not provided, teams will be numbered 1 to N.
 * @returns A RoundRobinResult like object containing the schedule.
 */
export default function partialRoundRobin<T extends string | number>(
  teams: number,
  numGamesToPlay: number,
  names: T[] = [],
): RoundRobinResult<T> {
  if (typeof teams === 'undefined' || teams < 2) {
    return {
      schedule: [],
      games: 0,
      teams: teams === 1 && names.length === 1 ? names : ((names.length === 0 && teams === 1) ? [1] as any as T[] : []),
      type: 'partial round robin',
    };
  }

  const actualNames =
    names.length === teams ? names : (Array.from({ length: teams }, (_, i) => i + 1) as any as T[]);

  if (numGamesToPlay <= 0) {
    return { schedule: [], games: 0, teams: actualNames, type: 'partial round robin' };
  }

  // Cap numGamesToPlay at the maximum possible (teams - 1)
  const maxGamesPossiblePerTeam = teams - 1;
  if (numGamesToPlay > maxGamesPossiblePerTeam && teams > 1) {
    console.warn(
      `Requested ${numGamesToPlay} games per team for ${teams} teams. Capping at ${maxGamesPossiblePerTeam} (full round-robin).`,
    );
    numGamesToPlay = maxGamesPossiblePerTeam;
  } else if (numGamesToPlay >= teams && teams <=1 ) { // e.g. 1 team, 1 game -> becomes 0 games
    numGamesToPlay = 0;
  }


  // 1. Generate all games from a full round robin schedule
  type RoundRobinSchedulerType = (teams: number, names?: T[]) => T[][][];
  let actualScheduler: RoundRobinSchedulerType;

  if (typeof roundrobinImported === 'function') {
    actualScheduler = roundrobinImported as RoundRobinSchedulerType;
  } else if (roundrobinImported && typeof (roundrobinImported as any).default === 'function') {
    actualScheduler = (roundrobinImported as any).default as RoundRobinSchedulerType;
  } else {
    // This case should ideally not be hit if roundrobinImported is always standard.
    // If it can be an object with 'default' being the function:
    if (roundrobinImported && typeof (roundrobinImported as any).roundrobin === 'function') {
        actualScheduler = (roundrobinImported as any).roundrobin as RoundRobinSchedulerType;
    } else {
        console.error('Roundrobin scheduler could not be loaded correctly. Type:', typeof roundrobinImported, roundrobinImported);
        throw new Error('Roundrobin scheduler could not be loaded correctly.');
    }
  }

  const allPossibleGamesRaw = actualScheduler(teams, actualNames);
  const allGamesFlat: { teams: T[] }[] = [];
  if (allPossibleGamesRaw) { // Ensure allPossibleGamesRaw is not null/undefined
    allPossibleGamesRaw.forEach(round => {
        if (round) { // Ensure round is not null/undefined
            round.forEach(matchup => {
                if (matchup && matchup.length >= 2) { // Ensure it's a valid matchup
                    allGamesFlat.push({ teams: [matchup[0], matchup[1]] });
                }
            });
        }
    });
  }


  // 2. Shuffle these games
  for (let i = allGamesFlat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allGamesFlat[i], allGamesFlat[j]] = [allGamesFlat[j], allGamesFlat[i]];
  }

  const schedule: Game[] = [];
  const gamesPlayedPerTeam: { [team: string | number]: number } = {};
  actualNames.forEach(team => (gamesPlayedPerTeam[team] = 0));
  let gameIdCounter = 0;

  // 3. Iterate through shuffled games and add if teams need to play
  for (const potentialGame of allGamesFlat) {
    const team1 = potentialGame.teams[0];
    const team2 = potentialGame.teams[1];

    // Condition to play:
    // (Team1 needs a game (<N) AND Team2 is not "too far over" (<=N), allowing Team2 to reach N+1)
    // OR
    // (Team2 needs a game (<N) AND Team1 is not "too far over" (<=N), allowing Team1 to reach N+1)
    // This ensures that at least one team is below N, and the other doesn't exceed N+1 games.
    if ( (gamesPlayedPerTeam[team1] < numGamesToPlay && gamesPlayedPerTeam[team2] <= numGamesToPlay) ||
         (gamesPlayedPerTeam[team2] < numGamesToPlay && gamesPlayedPerTeam[team1] <= numGamesToPlay) ) {
      schedule.push({
        id: `g${gameIdCounter++}`,
        round: 0, // Will be assigned properly later
        teams: [team1, team2],
      });
      gamesPlayedPerTeam[team1]++;
      gamesPlayedPerTeam[team2]++;
    }
  }

  // 4. Assign rounds systematically
  // This attempts to create rounds where no team plays twice in the same round.
  const assignedGameIdsToRound: Set<string | number> = new Set();
  let currentRoundNum = 1;
  while(assignedGameIdsToRound.size < schedule.length) {
    const teamsInCurrentRound: Set<string | number> = new Set();
    for(const game of schedule) {
      if(assignedGameIdsToRound.has(game.id)) continue; // Game already in a round

      const team1 = game.teams[0];
      const team2 = game.teams[1];

      if(!teamsInCurrentRound.has(team1) && !teamsInCurrentRound.has(team2)) {
        game.round = currentRoundNum;
        assignedGameIdsToRound.add(game.id);
        teamsInCurrentRound.add(team1);
        teamsInCurrentRound.add(team2);
      }
    }
    if(teamsInCurrentRound.size > 0) { // If any games were added to this round
        currentRoundNum++;
    } else if (assignedGameIdsToRound.size < schedule.length) {
        // This case should ideally not be hit if logic is perfect,
        // but as a fallback, if games remain unassigned, force them into subsequent rounds.
        // This might happen if remaining games all conflict.
        for(const game of schedule) {
            if(!assignedGameIdsToRound.has(game.id)) {
                game.round = currentRoundNum; // Assign to current (likely new) round
                assignedGameIdsToRound.add(game.id);
                // No need to add to teamsInCurrentRound as this is a fallback.
            }
        }
        currentRoundNum++; // Ensure next round number is fresh
    }
  }


  return {
    schedule: schedule.sort((a,b) => a.round - b.round || (a.id as string).localeCompare(b.id as string)),
    games: schedule.length,
    teams: actualNames,
    type: 'partial round robin',
  };
}
