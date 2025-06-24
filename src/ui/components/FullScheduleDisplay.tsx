import React from 'react';
import { Game } from '@lib/tourney-time';
import GameTable from './GameTable'; // Import the new GameTable component

interface FullScheduleDisplayProps {
  schedule: Game[] | Game[][];
  actualAreas: number;
  showHorizontalCombinedView: boolean;
  onToggleHorizontalView: (checked: boolean) => void;
  numAreasForToggle: number; // Used to enable/disable the toggle
}

// Styles moved from ResultsDisplay.tsx
const sectionStyle: React.CSSProperties = {
  marginTop: '15px',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '10px',
};
const thStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};
const tdStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};


// Function to transform schedule data for horizontal combined view
// Moved from ResultsDisplay.tsx
const transformScheduleToHorizontal = (
  schedule: Game[][], // Expected as Game[roundIndex][gameIndexInRound]
  numAreas: number,
): Array<Record<string, any>> => {
  if (!schedule || schedule.length === 0 || numAreas === 0) {
    return [];
  }

  const transformedRows: Array<Record<string, any>> = [];

  schedule.forEach((roundGames, roundIndex) => {
    if (roundGames.length === 0) return;

    const gamesByAreaInRound: Game[][] = Array.from({ length: numAreas }, () => []);
    roundGames.forEach((game, gameIndexInRound) => {
      const areaIdx = gameIndexInRound % numAreas;
      gamesByAreaInRound[areaIdx].push(game);
    });

    const maxSlotsInRound = Math.max(...gamesByAreaInRound.map(areaGamesList => areaGamesList.length));
    if (maxSlotsInRound === 0) return;

    for (let slot = 0; slot < maxSlotsInRound; slot++) {
      const row: Record<string, any> = { round: roundIndex + 1 };
      for (let areaIdx = 0; areaIdx < numAreas; areaIdx++) {
        const game = gamesByAreaInRound[areaIdx]?.[slot];
        if (game) {
          row[`area${areaIdx + 1}Team1`] = game.teams[0];
          row[`area${areaIdx + 1}Team2`] = game.teams[1];
        } else {
          row[`area${areaIdx + 1}Team1`] = '';
          row[`area${areaIdx + 1}Team2`] = '';
        }
      }
      transformedRows.push(row);
    }
  });

  return transformedRows;
};


const FullScheduleDisplay: React.FC<FullScheduleDisplayProps> = ({
  schedule: scheduleData, // Renamed for clarity within the component
  actualAreas,
  showHorizontalCombinedView,
  onToggleHorizontalView,
  numAreasForToggle,
}) => {
  if (!scheduleData || scheduleData.length === 0) {
    return <p>No games in this schedule.</p>;
  }

  // Case 1: Horizontal Combined View for multiple areas
  if (showHorizontalCombinedView && actualAreas > 1 && Array.isArray(scheduleData) && scheduleData.length > 0 && Array.isArray(scheduleData[0])) {
    const transformedData = transformScheduleToHorizontal(scheduleData as Game[][], actualAreas);

    if (transformedData.length === 0) {
      return <p>No games to display in combined horizontal view.</p>;
    }

    const headers = ['Round'];
    for (let i = 1; i <= actualAreas; i++) {
      headers.push(`Area ${i}: Team 1 (Black)`);
      headers.push(`Area ${i}: Team 2 (White)`);
    }

    return (
      <div style={sectionStyle}>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showHorizontalCombinedView}
              onChange={(e) => onToggleHorizontalView(e.target.checked)}
              disabled={numAreasForToggle <= 1}
            />
            Show Combined Horizontal View
          </label>
        </div>
        <h4>Full Game Schedule (Combined Horizontal View)</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                {headers.map(header => <th key={header} style={thStyle}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {transformedData.map((row, rowIndex) => (
                <tr key={`hrow-${rowIndex}`}>
                  <td style={tdStyle}>{row.round}</td>
                  {Array.from({ length: actualAreas }).map((_, areaIndex) => (
                    <React.Fragment key={`hcell-area-${areaIndex}`}>
                      <td style={tdStyle}>{row[`area${areaIndex + 1}Team1`]}</td>
                      <td style={tdStyle}>{row[`area${areaIndex + 1}Team2`]}</td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Case 2: Single actual area or schedule is already flat (Game[])
  // Or when showHorizontalCombinedView is false (default view for multiple areas)
  if (actualAreas === 1 || !Array.isArray(scheduleData[0]) || !showHorizontalCombinedView) {
    let content;
    if (actualAreas > 1 && !showHorizontalCombinedView) {
      // Default view: Separate tables per area
      const scheduleByArea: Game[][] = Array.from({ length: actualAreas }, () => []);
      const gameGroups = scheduleData as Game[][];

      gameGroups.forEach((roundGameGroup) => {
        roundGameGroup.forEach((game, gameIndexInGroup) => {
          const areaIdx = gameIndexInGroup % actualAreas;
          if (areaIdx < actualAreas) {
            scheduleByArea[areaIdx].push(game);
          }
        });
      });

      content = (
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
    } else {
      // Single area or already flat (e.g. results.schedule is Game[])
      const games = (Array.isArray(scheduleData[0])
        ? (scheduleData as Game[][]).flat()
        : scheduleData) as Game[];

      content = (
        <div>
          <h4>Full Game Schedule {actualAreas === 1 ? '(Single Area)' : ''}</h4>
          <GameTable games={games} />
        </div>
      );
    }
    return (
        <div style={sectionStyle}>
            <div>
                <label>
                    <input
                    type="checkbox"
                    checked={showHorizontalCombinedView}
                    onChange={(e) => onToggleHorizontalView(e.target.checked)}
                    disabled={numAreasForToggle <= 1}
                    />
                    Show Combined Horizontal View
                </label>
            </div>
            {content}
        </div>
    )
  }

  // Fallback if none of the conditions are met
  return (
    <div style={sectionStyle}>
        <div>
            <label>
                <input
                type="checkbox"
                checked={showHorizontalCombinedView}
                onChange={(e) => onToggleHorizontalView(e.target.checked)}
                disabled={numAreasForToggle <= 1}
                />
                Show Combined Horizontal View
            </label>
        </div>
        <p>Unable to render schedule. Please check data.</p>
    </div>
  );
};

export default FullScheduleDisplay;
