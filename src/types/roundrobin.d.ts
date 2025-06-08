declare module 'roundrobin' {
  // Signature based on documentation: roundrobin(numberOfParticipants, [array_of_participants], [seed])
  // T defaults to string if not provided, but can be number.
  function roundrobin<T = string | number>(
    n: number,
    participants?: T[],
    seed?: number,
  ): T[][][];
  export = roundrobin;
}
