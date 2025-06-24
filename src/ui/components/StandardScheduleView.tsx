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

  const hasBackToBackGames = React.useMemo(() => {
    if (!scheduleData || scheduleData.length === 0) {
      return false;
    }
    if (Array.isArray(scheduleData[0])) {
      // Game[][]
      return (scheduleData as Game[][]).some(block =>
        block.some(game => game.backToBackTeams && game.backToBackTeams.length > 0)
      );
    } else {
      // Game[]
      return (scheduleData as Game[]).some(
        game => game.backToBackTeams && game.backToBackTeams.length > 0
      );
    }
  }, [scheduleData]);

  if (!scheduleData || scheduleData.length === 0) {
    return <p>No games in this schedule.</p>;
  }

  const messageStyle: React.CSSProperties = {
    color: 'navy',
    backgroundColor: '#e6f7ff',
    border: '1px solid #91d5ff',
    padding: '8px',
    marginTop: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
  };

  // Main return for the component structure
  return (
    <>
      {hasBackToBackGames && (
        <p style={messageStyle}>
          Teams highlighted in red are playing back-to-back games.
        </p>
      )}

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
