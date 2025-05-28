import singleArea from './single';
import multipleArea from './multiple';
import { Schedule as TourneySchedule, Schedule as PlayoffSchedule } from '../tourney-time'; // Assuming types are defined in tourney-time

interface GeneratorOptions {
  tourneySchedule: TourneySchedule;
  playoffSchedule: PlayoffSchedule;
  areas: number;
}

export default ({
  tourneySchedule,
  playoffSchedule,
  areas,
}: GeneratorOptions) => {
  if (areas === 1) {
    return singleArea({ tourneySchedule, playoffSchedule });
  } else {
    return multipleArea({ tourneySchedule, playoffSchedule, areas });
  }
};
