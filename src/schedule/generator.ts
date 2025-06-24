import singleArea from './single';
import multipleArea from './multiple';
import {
  Schedule as TourneySchedule,
  Schedule as PlayoffSchedule,
  Game,
} from '../tourney-time';
import { annotateBackToBackGames } from './annotator';

interface GeneratorOptions {
  tourneySchedule: TourneySchedule;
  playoffSchedule: PlayoffSchedule;
  areas: number;
}

export default ({
  tourneySchedule,
  playoffSchedule,
  areas,
}: GeneratorOptions): Game[] | Game[][] => { // Explicitly type the return
  let generatedSchedule: Game[] | Game[][];
  if (areas === 1) {
    generatedSchedule = singleArea({ tourneySchedule, playoffSchedule });
  } else {
    generatedSchedule = multipleArea({ tourneySchedule, playoffSchedule, areas });
  }
  // Annotate the generated schedule before returning
  return annotateBackToBackGames(generatedSchedule);
};
