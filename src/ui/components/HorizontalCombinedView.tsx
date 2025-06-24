import React from 'react';
import { Game } from '@lib/tourney-time';

interface HorizontalCombinedViewProps {
  scheduleData: Game[][]; // Expected as Game[roundIndex][gameIndexInRound]
  actualAreas: number;
}

// Styles originally from ResultsDisplay.tsx / FullScheduleDisplay.tsx
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
// Moved from FullScheduleDisplay.tsx
const transformScheduleToHorizontal = (
  schedule: Game[][],
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

const HorizontalCombinedView: React.FC<HorizontalCombinedViewProps> = ({
  scheduleData,
  actualAreas,
}) => {
  if (!scheduleData || scheduleData.length === 0 || actualAreas <= 1) {
    // This view is specifically for multiple areas and combined view
    return <p>Horizontal combined view is not applicable for this schedule.</p>;
  }

  const transformedData = transformScheduleToHorizontal(scheduleData, actualAreas);

  if (transformedData.length === 0) {
    return <p>No games to display in combined horizontal view.</p>;
  }

  const headers = ['Round'];
  for (let i = 1; i <= actualAreas; i++) {
    headers.push(`Area ${i}: Team 1 (Black)`);
    headers.push(`Area ${i}: Team 2 (White)`);
  }

  return (
    <div>
      <h4>Full Game Schedule (Combined Horizontal View)</h4>
      <div style={{ overflowX: 'auto' }}> {/* Make table horizontally scrollable */}
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
};

export default HorizontalCombinedView;
