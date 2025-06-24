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

    // All games in gamesByAreaInRound for a given roundIndex share the same actual round number.
    // We can pick the round number from the first game in the first non-empty area slot.
    // Or, more simply, just use roundIndex + 1 as the base round for this visual block,
    // as the input `schedule` is Game[roundIndex][gameIndexInRound].
    // The key is that individual game objects `game.round` should be used if they accurately
    // reflect the true round, especially if `scheduleBalancer` might change round numbers.
    // For now, assuming `game.round` from the input `scheduleData` is the source of truth for each game.

    for (let slot = 0; slot < maxSlotsInRound; slot++) {
      // Initialize row with a common round number for this visual row.
      // The round number displayed per row will be determined by the first game encountered in that row,
      // or it can be set based on roundIndex if all games in this "horizontal slot" belong to the same logical round.
      // Let's ensure the 'Round' column shows the round of the games in that row.
      // We will determine the round for the row from the first available game in the slot.
      let commonRoundForRow: number | string = '';

      const row: Record<string, any> = {}; // gameId and team data will be added per area

      for (let areaIdx = 0; areaIdx < numAreas; areaIdx++) {
        const game = gamesByAreaInRound[areaIdx]?.[slot];
        if (game) {
          if (commonRoundForRow === '') {
            commonRoundForRow = game.round; // Set common round from the first game found in this slot
          }
          row[`area${areaIdx + 1}GameId`] = game.id;
          row[`area${areaIdx + 1}Team1`] = game.teams[0];
          row[`area${areaIdx + 1}Team2`] = game.teams[1];
        } else {
          row[`area${areaIdx + 1}GameId`] = '';
          row[`area${areaIdx + 1}Team1`] = '';
          row[`area${areaIdx + 1}Team2`] = '';
        }
      }
      row.round = commonRoundForRow !== '' ? commonRoundForRow : roundIndex + 1; // Fallback if no games in slot
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
    headers.push(`Area ${i}: Game ID`);
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
                    <td style={tdStyle}>{row[`area${areaIndex + 1}GameId`]}</td>
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
