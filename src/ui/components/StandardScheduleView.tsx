import React from 'react';
import { Game } from '@lib/tourney-time';
import GameTable from './GameTable'; // Assuming GameTable is in the same directory

interface StandardScheduleViewProps {
  scheduleData: Game[] | Game[][];
  actualAreas: number;
}

const StandardScheduleView: React.FC<StandardScheduleViewProps> = ({
  scheduleData,
  actualAreas,
}) => {
  if (!scheduleData || scheduleData.length === 0) {
    return <p>No games in this schedule.</p>;
  }

  // Case: Multiple areas, display per-area tables
  if (actualAreas > 1 && Array.isArray(scheduleData[0])) {
    const scheduleByArea: Game[][] = Array.from({ length: actualAreas }, () => []);
    const gameGroups = scheduleData as Game[][]; // Type assertion

    gameGroups.forEach((roundGameGroup) => {
      roundGameGroup.forEach((game, gameIndexInGroup) => {
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
  // This also covers the case where actualAreas > 1 but scheduleData is not Game[][]
  // (which would be unusual for multi-area but handled)
  const games = (Array.isArray(scheduleData[0])
    ? (scheduleData as Game[][]).flat() // Flatten if it's Game[][] but actualAreas is 1 (or other reasons)
    : scheduleData) as Game[]; // Already Game[]

  return (
    <div>
      <h4>Full Game Schedule {actualAreas === 1 ? '(Single Area)' : ''}</h4>
      <GameTable games={games} />
    </div>
  );
};

export default StandardScheduleView;
