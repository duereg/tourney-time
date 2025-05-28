declare module 'roundrobin' {
  // The package returns an array of rounds, where each round is an array of games (pairs of teams/players).
  // If T is the type of a team/player (e.g., string or number), a game is T[].
  // So, a round is T[][], and the whole schedule is T[][][].
  function roundrobin<T>(n: number | T[], seed?: number): T[][][];
  export = roundrobin;
}
