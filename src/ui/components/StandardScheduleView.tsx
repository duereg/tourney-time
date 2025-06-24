import React from 'react';
import { Game } from '@lib/tourney-time';
import GameTable from './GameTable'; // Assuming GameTable is in the same directory
import { annotateBackToBackGames } from '../utils/annotateBackToBackGames'; // Import the moved function

interface StandardScheduleViewProps {
  scheduleData: Game[] | Game[][];
  actualAreas: number;
}

const StandardScheduleView: React.FC<StandardScheduleViewProps> = ({
  scheduleData: rawScheduleData, // Rename prop to avoid confusion
  actualAreas,
}) => {
  // Annotate games before any other processing
  const scheduleData = React.useMemo(
    () => annotateBackToBackGames(rawScheduleData),
    [rawScheduleData]
  );

  if (!scheduleData || scheduleData.length === 0) {
    return <p>No games in this schedule.</p>;
  }

  // Case: Multiple areas, display per-area tables
  if (actualAreas > 1 && Array.isArray(scheduleData[0])) {
    // scheduleData here is Game[][] with annotated games
    const gameGroups = scheduleData as Game[][];
    const scheduleByArea: Game[][] = Array.from(
      { length: actualAreas },
      () => [],
    );

    gameGroups.forEach((roundGameGroup) => {
      roundGameGroup.forEach((game, gameIndexInGroup) => {
        // game object here already has backToBackTeams if applicable
        const areaIdx = gameIndexInGroup % actualAreas;
        if (areaIdx < actualAreas) {
          scheduleByArea[areaIdx].push(game);
        }
      });
    });

    return (
      <div>
        <h4>Full Game Schedule (Per Area):</h4>
        {scheduleByArea.map((areaSchedule, areaIndex) => (
          <div key={`area-sched-${areaIndex}`} style={{ marginBottom: '20px' }}>
            <h5>Schedule for Area {areaIndex + 1}</h5>
            <GameTable games={areaSchedule} areaTitle={`Area ${areaIndex + 1}`} />
          </div>
        ))}
      </div>
    );
  }

  // Case: Single area or schedule is already flat (Game[])
  // scheduleData here is Game[] with annotated games
  const games = (
    Array.isArray(scheduleData[0])
      ? (scheduleData as Game[][]).flat()
      : scheduleData
  ) as Game[];

  return (
    <div>
      <h4>Full Game Schedule {actualAreas === 1 ? '(Single Area)' : ''}</h4>
      <GameTable games={games} />
    </div>
  );
};

export default StandardScheduleView;
