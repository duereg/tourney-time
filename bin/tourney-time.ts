#!/usr/bin/env ts-node

import yargs from 'yargs';
import tourneyTime from '../src/tourney-time'; // Using path alias, assuming tourney-time exports default
import { Game } from '../src/tourney-time'; // Assuming these types are exported, Schedule removed

interface Argv {
  teams: number;
  time?: number;
  rest?: number;
  areas?: number;
  playoffTime?: number;
  playoffRest?: number;
  [key: string]: unknown; // For other yargs properties like _ and $0
}

const argv = yargs
  .usage('Usage: $0 --teams [num] -t [num] -r [num] -a [num] -p [num] -o [num]')
  .demandOption(['teams'])
  .describe('teams', 'number of players/teams competing')
  .options('t', {
    alias: 'time',
    default: 33,
    describe: 'time in minutes for each tourney game',
    type: 'number',
  })
  .options('r', {
    alias: 'rest',
    default: 7,
    describe: 'time in minutes between each tourney game',
    type: 'number',
  })
  .options('a', {
    alias: 'areas',
    default: 1,
    describe: 'number of playing areas available',
    type: 'number',
  })
  .options('p', {
    alias: 'playoffTime',
    default: 33,
    describe: 'time in minutes for each playoff game',
    type: 'number',
  })
  .options('o', {
    alias: 'playoffRest',
    default: 12,
    describe: 'time in minutes between each playoff game',
    type: 'number',
  }).argv as Argv;

const { teams, time, rest, areas, playoffTime, playoffRest } = argv;

// Pass the relevant properties from argv to tourneyTime
const { timeNeededMinutes, tourneySchedule, playoffSchedule, schedule } =
  tourneyTime({
    teams,
    gameTime: time, // map alias to expected property name
    restTime: rest, // map alias to expected property name
    areas,
    playoffTime,
    playoffRestTime: playoffRest, // map alias to expected property name
  });

const hours = Math.floor(timeNeededMinutes / 60);
const minutes = timeNeededMinutes % 60;

let totalTime = '';
if (hours) {
  totalTime += `${hours} hours`;
}
if (hours && minutes) {
  totalTime += ', ';
}
if (minutes) {
  totalTime += `${minutes} minutes`;
}

console.log(`For ${teams} teams
               Playing ${time} minute tournament games with ${rest} minute breaks in between
               And ${playoffTime} minute playoff games with ${playoffRest} minute breaks in between
               on ${tourneySchedule.areas} playing area(s)
               you'll play a ${tourneySchedule.type} tournament and a ${playoffSchedule.type} playoffs
               with ${tourneySchedule.games} tourney games and ${playoffSchedule.games} playoff games
               for ${tourneySchedule.games + playoffSchedule.games} total games
               which will take ${totalTime} `);

if (schedule?.length) {
  // Flatten the schedule array in case it's Game[][]
  const flatSchedule: Game[] = Array.isArray(schedule[0])
    ? (schedule as Game[][]).flat()
    : (schedule as Game[]);
  console.log(flatSchedule.map((game: Game) => JSON.stringify(game)));
}
