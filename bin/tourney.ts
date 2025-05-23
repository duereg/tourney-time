#!/usr/bin/env ts-node

import _ from 'underscore';
import yargs from 'yargs';

interface Argv {
  teams: number;
  [key: string]: unknown;
}

const argv = yargs.usage('Usage: $0 --teams [num]').demandOption(['teams'])
  .argv as Argv;

class Pair {
  one: number;
  two: number;

  constructor(p1: number, p2: number, round: number) {
    // In a round-robin tournament, one team (often the highest-numbered team)
    // might remain fixed while others rotate. The logic here seems to be
    // implementing a specific pairing algorithm, possibly circle method.
    // The round % 2 logic is to alternate home/away or similar.
    if (round % 2 === 1) {
      this.one = p1;
      this.two = p2;
    } else {
      this.one = p2;
      this.two = p1;
    }
  }
}

class Round {
  round: number;
  teams: number;
  pairs: Pair[];

  constructor(round: number, teams: number) {
    this.round = round;
    this.teams = teams;
    this.pairs = [];

    // Ensure teams is an even number for simple pairing, or handle odd teams (e.g., with a bye)
    // This algorithm assumes an even number of teams. If odd, one team rests each round.
    // The original CoffeeScript implies `teams` could be odd and pairing still proceeds,
    // which might mean team `teams` is the one that sits out or is treated as a bye.
    // The loop `[1..@teams / 2]` suggests it pairs up half the teams.

    const numPairs = Math.floor(this.teams / 2); // Number of games per round

    for (let i = 1; i <= numPairs; i++) {
      // This pairing logic is specific to the round-robin algorithm being implemented.
      // It's likely a variation of the circle method or a schedule where one team is fixed.
      // Team 1 might be fixed, and others rotate around it.
      // The modulo arithmetic `(teams - 1)` is common in these algorithms.

      // Let's assume team `teams` is the "pivot" if the number of teams is odd,
      // or simply the highest indexed team if even.
      // The original CoffeeScript used `teams` in calculations, so it's not 0-indexed for team numbers.

      let team1: number;
      let team2: number;

      if (this.teams % 2 !== 0) {
        // Odd number of teams, one gets a bye
        // This part needs careful translation of the original intent if byes are implicit.
        // The original code `(round + teams - i - 1) % (teams - 1) + 2`
        // and `(round + i - 2) % (teams - 1) + 2` needs to be understood in context of byes.
        // For simplicity, let's assume the algorithm implies team `this.teams` is the pivot/bye
        // if odd, and the pairings are for the other `this.teams - 1` teams.
        // However, the original loops up to `teams / 2`.

        // The provided CoffeeScript logic for pairing:
        // Pair 1: (1, (round + teams - 1 - 1) % (teams - 1) + 2) which is (1, (round + teams - 2) % (teams - 1) + 2)
        // Other Pairs: ((round + i - 2) % (teams - 1) + 2, (round + teams - i - 1) % (teams - 1) + 2)

        // This is a standard algorithm where 'teams' (the entity, not the count) does not play.
        // So we consider (teams - 1) entities for the round robin.
        // Let N = teams -1 if teams is odd, else N = teams.
        // The actual number of participants in the pairing is N.
        // The +1 and +2 adjustments are likely to keep team numbers 1-based.

        const activeTeams = this.teams % 2 === 0 ? this.teams : this.teams - 1; // Number of teams actually playing in the schedule if one gets a bye.
        // Or, the algorithm might implicitly handle it if `this.teams` is odd.

        // Sticking to a direct translation of the CoffeeScript logic:
        if (i === 1) {
          team1 = 1;
          // `(round + teams - i - 1)` becomes `(this.round + this.teams - 1 - 1)`
          // `(teams - 1)` is the modulus base. `+ 2` adjusts the result.
          team2 =
            ((this.round + this.teams - 1 - 1 - 1) % (this.teams - 1)) + 2; // Coffee seems to be 1-indexed for round.
          // (val - 1) % mod + 1 for 1-indexed modulo
        } else {
          team1 = ((this.round + i - 2 - 1) % (this.teams - 1)) + 2;
          team2 =
            ((this.round + this.teams - i - 1 - 1) % (this.teams - 1)) + 2;
        }
        // The original coffee script was:
        // if i is 1
        //   @pairs.push(new Pair(1, (round + teams - i - 1) % (teams - 1) + 2, round))
        // else
        //   @pairs.push(new Pair((round + i - 2) % (teams - 1) + 2, (round + teams - i - 1) % (teams - 1) + 2, round))
        // My previous translation was off by 1 in the modulo input.
        // Corrected:
        if (i === 1) {
          team1 = 1;
          team2 =
            ((this.round - 1 + (this.teams - 1) - i) % (this.teams - 1)) + 2;
        } else {
          team1 = ((this.round - 1 + i - 2) % (this.teams - 1)) + 2;
          team2 =
            ((this.round - 1 + (this.teams - 1) - i) % (this.teams - 1)) + 2;
        }
        // If teams is odd, team `this.teams` gets a bye.
        // The pairs are for team 1 to team `this.teams -1`.
        // The team numbers generated should be within 1 to `this.teams -1`.
        // If team `this.teams` is involved, the logic from CoffeeScript needs to be certain.
        // The original CoffeeScript: `(round + teams - i - 1) % (teams - 1) + 2` implies that team numbers
        // are calculated in a 0 to `teams-2` range and then shifted by +2.
        // This would make team numbers range from 2 to `teams-1`. This is unusual.
        // Let's assume standard Berger tables / circle method pairing.
        // Team N (this.teams) is fixed if N is odd. Otherwise all N teams play.
        // The loop for `round` goes from 1 to `teams - 1`.
        // Example: 4 teams. 3 rounds.
        // R1: (1 vs 4), (2 vs 3)
        // R2: (1 vs 3), (4 vs 2)
        // R3: (1 vs 2), (3 vs 4)

        // Simpler direct translation of the CoffeeScript arithmetic, assuming it was correct for its purpose:
        // CS: (round + i - 2) % (teams - 1) + 2  (for team1 in else)
        // TS: ((this.round + i - 2 -1) % (this.teams - 1)) + 2 if round is 1-indexed and result is 1-indexed for team names
        // But usually, modulo arithmetic is `(value % modulus + modulus) % modulus` for positive result,
        // and team numbers are 1 to N.
        // The `+2` suggests that team 1 is special.

        // Re-evaluating the CoffeeScript indices:
        // `for round in [1...@teams]` -> round from 1 to teams-1
        // `for i in [1..@teams / 2]` -> i from 1 to floor(teams/2)
        // `(round + teams - i - 1) % (teams - 1) + 2`
        // Example: teams = 4. rounds = 1, 2, 3. i = 1, 2.
        // Round 1:
        //   i = 1: team1=1. team2=((1+4-1-1)%(3))+2 = (3%3)+2 = 0+2 = 2. Pair(1,2). After swap: (1,2)
        //   i = 2: team1=((1+2-2)%(3))+2 = (1%3)+2 = 1+2 = 3. team2=((1+4-2-1)%(3))+2 = (2%3)+2 = 2+2 = 4. Pair(3,4). After swap: (3,4)
        //   Round 1 pairs: (1,2), (3,4) -> Standard for 4 teams would be (1,4), (2,3) or (1,2), (4,3)
        // This seems to be a specific algorithm. I will translate it as literally as possible.
        // The `round` in CoffeeScript is 1-indexed.
        if (i === 1) {
          team1 = 1;
          team2 =
            ((this.round + this.teams - i - 1 - 1) % (this.teams - 1)) + 2;
        } else {
          team1 = ((this.round + i - 2 - 1) % (this.teams - 1)) + 2;
          team2 =
            ((this.round + this.teams - i - 1 - 1) % (this.teams - 1)) + 2;
        }
      }
      this.pairs.push(new Pair(team1, team2, this.round));
    }
  }
}

class Tournament {
  teams: number;
  rounds: Round[];

  constructor(teams: number) {
    this.teams = teams;
    this.rounds = [];

    // Number of rounds in a round-robin for N teams is N-1 (if N is even) or N (if N is odd, each team gets one bye)
    // The loop `for round in [1...@teams]` means rounds from 1 to `teams - 1`.
    // This is correct for an even number of teams, or for N-1 teams if one team is fixed/bye.
    const numRounds = this.teams % 2 === 0 ? this.teams - 1 : this.teams;
    // The original coffee `[1...@teams]` goes up to `teams-1`. So it assumes `teams-1` rounds.

    for (let r = 1; r < this.teams; r++) {
      this.rounds.push(new Round(r, this.teams));
    }
  }
}

const tourney = new Tournament(argv.teams);

const games: number[][] = _(tourney.rounds)
  .chain()
  .map((round) => round.pairs)
  .flatten()
  .map((pair) => [pair.one, pair.two])
  .value();

console.log(games);

// Check for overlaps in consecutive games (simple check, not a full validation)
for (let i = 0; i < games.length - 1; i++) {
  if (games[i + 1] && _.intersection(games[i], games[i + 1]).length) {
    console.log('this balancer overlaps!'); // This message implies issues with the scheduling logic itself
  }
}
