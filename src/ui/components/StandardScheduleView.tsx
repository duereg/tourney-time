import React from 'react';
import { Game } from '@lib/tourney-time';
import GameTable from './GameTable'; // Assuming GameTable is in the same directory
// Removed import for annotateBackToBackGames as it's now done in the library

interface StandardScheduleViewProps {
  scheduleData: Game[] | Game[][]; // This data is now expected to be pre-annotated
  actualAreas: number;
}

const StandardScheduleView: React.FC<StandardScheduleViewProps> = ({
  scheduleData, // Use scheduleData directly as it's pre-annotated
  actualAreas,
}) => {
  if (!scheduleData || scheduleData.length === 0) {
    return <p>No games in this schedule.</p>;
  }

  // Main return for the component structure
  // The informational message and its logic (hasBackToBackGames) have been moved to FullScheduleDisplay.tsx
  return (
    <>
      {/* Logic for displaying tables based on actualAreas and scheduleData structure */}
      {actualAreas > 1 && Array.isArray(scheduleData[0]) ? (
        <div>
          <h4>Full Game Schedule (Per Area):</h4>
          {(() => { // Use IIFE to encapsulate logic for scheduleByArea
            const gameGroups = scheduleData as Game[][];
            const scheduleByArea: Game[][] = Array.from({ length: actualAreas }, () => []);
            gameGroups.forEach(roundGameGroup => {
              roundGameGroup.forEach((game, gameIndexInGroup) => {
                const areaIdx = gameIndexInGroup % actualAreas;
                if (areaIdx < actualAreas) {
                  scheduleByArea[areaIdx].push(game);
                }
              });
            });
            return scheduleByArea.map((areaSchedule, areaIndex) => (
              <div key={`area-sched-${areaIndex}`} style={{ marginBottom: '20px' }}>
                <h5>Schedule for Area {areaIndex + 1}</h5>
                <GameTable games={areaSchedule} areaTitle={`Area ${areaIndex + 1}`} />
              </div>
            ));
          })()}
        </div>
      ) : (
        <div>
          <h4>
            Full Game Schedule{' '}
            {actualAreas === 1 && !Array.isArray(scheduleData[0]) ? '(Single Area)' : ''}
          </h4>
          <GameTable games={
            Array.isArray(scheduleData[0])
            ? (scheduleData as Game[][]).flat()
            : scheduleData as Game[]
          } />
        </div>
      )}
    </>
  );
};

export default StandardScheduleView;
