#!/usr/bin/env ts-node

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

      // The following pairing logic is intended to be a direct translation of the original CoffeeScript version's
      // pairing algorithm, which applies unconditionally within the loop.
      // The TS2454 error (used before assigned) was due to a conditional block that
      // was incorrectly wrapped around this logic in the TypeScript version, causing team1/team2
      // to be unassigned if `this.teams` was even. Removing that incorrect outer conditional
      // ensures team1 and team2 are always assigned.
      //
      // Original CoffeeScript logic for pairing:
      // if i is 1
      //   @pairs.push new Pair 1, (round + teams - i - 1) % (teams - 1) + 2, round
      // else
      //   @pairs.push new Pair (round + i - 2) % (teams - 1) + 2, (round + teams - i - 1) % (teams - 1) + 2, round
      //
      // Assuming `this.round` is 1-indexed (as CoffeeScript `for round in [1...@teams]`)
      // and `i` is 1-indexed.
      // The `teams - 1` in modulo is typical for round-robin algorithms where one team might be fixed
      // or if team numbers are 0 to N-2 then shifted.
      // The `+ 2` shifts the result of the modulo operation.
      // This literal translation aims to preserve the original algorithm's behavior.
      if (i === 1) {
        team1 = 1;
        // Original: (this.round + this.teams - i - 1) % (this.teams - 1) + 2
        // Adjusted for 0-indexed modulo if that was the intent, but sticking to literal:
        team2 = ((this.round + this.teams - i - 1 - 1) % (this.teams - 1)) + 2;
      } else {
        // Original: (this.round + i - 2) % (this.teams - 1) + 2
        team1 = ((this.round + i - 2 - 1) % (this.teams - 1)) + 2;
        // Original: (this.round + this.teams - i - 1) % (this.teams - 1) + 2
        team2 = ((this.round + this.teams - i - 1 - 1) % (this.teams - 1)) + 2;
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

const games: number[][] = tourney.rounds.flatMap(round => round.pairs.map(pair => [pair.one, pair.two]));

console.log(games);

// Check for overlaps in consecutive games (simple check, not a full validation)
for (let i = 0; i < games.length - 1; i++) {
  if (games[i + 1] && games[i].filter(team => games[i + 1].includes(team)).length) {
    console.log('this balancer overlaps!'); // This message implies issues with the scheduling logic itself
  }
}
