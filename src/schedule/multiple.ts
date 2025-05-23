import _ from 'underscore';
import { TourneySchedule, PlayoffSchedule, Game } from '../tourney-time'; // Assuming types are defined

interface ScheduleBalancerInput {
  schedule: Game[];
  // Add other properties if they exist on thingToSchedule
}

const scheduleBalancer = (
  thingToSchedule: ScheduleBalancerInput,
  areas: number,
): Game[][] => {
  const balancedSchedule: Game[][] = [];
  let currentRound = 1;

  for (const game of thingToSchedule.schedule) {
    if (balancedSchedule.length) {
      const round = balancedSchedule[balancedSchedule.length - 1];

      if (round.length < areas) {
        const hasTeam = _(round)
          .chain()
          .map((aRound) => aRound.teams) // Ensure aRound has teams property
          .flatten()
          .intersection(game.teams)
          .value().length;

        if (hasTeam || currentRound !== game.round) {
          balancedSchedule.push([game]);
        } else {
          round.push(game);
        }
      } else {
        balancedSchedule.push([game]);
      }
    } else {
      balancedSchedule.push([game]);
    }
    currentRound = game.round;
  }
  return balancedSchedule;
};

interface MultipleOptions {
  tourneySchedule?: TourneySchedule;
  playoffSchedule?: PlayoffSchedule;
  areas: number;
}

export default ({
  tourneySchedule,
  playoffSchedule,
  areas,
}: MultipleOptions): Game[][] => {
  if (!tourneySchedule) {
    throw new Error('You must provide a tournament schedule to continue');
  }
  if (!playoffSchedule) {
    throw new Error('You must provide a playoff schedule to continue');
  }

  let balancedSchedule: Game[][] = [];

  if (tourneySchedule.schedule) {
    balancedSchedule = scheduleBalancer(tourneySchedule, areas);
  }

  if (playoffSchedule.schedule) {
    balancedSchedule = balancedSchedule.concat(
      scheduleBalancer(playoffSchedule, areas),
    );
  }

  return balancedSchedule;
};
