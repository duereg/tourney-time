import { Schedule as TourneySchedule, Schedule as PlayoffSchedule, Game } from '../tourney-time'; // Assuming types are defined

interface SingleOptions {
  tourneySchedule?: TourneySchedule;
  playoffSchedule?: PlayoffSchedule;
}

export default ({
  tourneySchedule,
  playoffSchedule,
}: SingleOptions): Game[] => {
  if (!tourneySchedule) {
    throw new Error('You must provide a tournament schedule to continue');
  }
  if (!playoffSchedule) {
    throw new Error('You must provide a playoff schedule to continue');
  }

  let balancedSchedule: Game[] = [];

  if (tourneySchedule.schedule) {
    balancedSchedule = tourneySchedule.schedule;
  }

  if (playoffSchedule.schedule) {
    balancedSchedule = balancedSchedule.concat(playoffSchedule.schedule);
  }

  return balancedSchedule;
};
