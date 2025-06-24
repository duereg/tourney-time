import React, { useState } from 'react';
import { TourneyTimeResult, Game, Schedule } from '@lib/tourney-time';
import { formatTime } from '../utils/formatTime';

interface ResultsDisplayProps {
  results: TourneyTimeResult | null;
  error: string | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, error }) => {
  const [showHorizontalCombinedView, setShowHorizontalCombinedView] = useState(false);

  if (error) {
    return (
      <div
        style={{
          color: 'red',
          marginTop: '20px',
          padding: '10px',
          border: '1px solid red',
        }}
      >
        Error: {error}
      </div>
    );
  }

  if (!results) {
    return (
      <div style={{ marginTop: '20px' }}>Submit the form to see results.</div>
    );
  }

  const sectionStyle: React.CSSProperties = {
    marginTop: '15px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const preStyle: React.CSSProperties = {
    backgroundColor: '#f4f4f4',
    border: '1px solid #ddd',
    padding: '10px',
    overflowX: 'auto',
    maxHeight: '400px', // Limit height for long schedules
  };

  // Function to transform schedule data for horizontal combined view
  const transformScheduleToHorizontal = (
    schedule: Game[][], // Expected as Game[roundIndex][gameIndexInRound]
    numAreas: number,
  ): Array<Record<string, any>> => {
    if (!schedule || schedule.length === 0 || numAreas === 0) {
      return [];
    }

    const transformedRows: Array<Record<string, any>> = [];

    // schedule is Game[roundIdx][gameInRoundIdx]
    // gameInRoundIdx are distributed across areas.
    // e.g., for 2 areas: gameInRoundIdx=0 -> Area 1, gameInRoundIdx=1 -> Area 2, gameInRoundIdx=2 -> Area 1 (next slot)

    schedule.forEach((roundGames, roundIndex) => {
      if (roundGames.length === 0) return;

      // Store games for the current round, organized by area and then by slot within that area for that round
      const gamesByAreaInRound: Game[][] = Array.from({ length: numAreas }, () => []);
      roundGames.forEach((game, gameIndexInRound) => {
        const areaIdx = gameIndexInRound % numAreas; // 0-indexed area
        gamesByAreaInRound[areaIdx].push(game);
      });

      // Determine max game slots needed for this round across all areas
      const maxSlotsInRound = Math.max(...gamesByAreaInRound.map(areaGamesList => areaGamesList.length));
      if (maxSlotsInRound === 0) return;

      for (let slot = 0; slot < maxSlotsInRound; slot++) {
        const row: Record<string, any> = { round: roundIndex + 1 }; // Use 1-indexed round for display
        for (let areaIdx = 0; areaIdx < numAreas; areaIdx++) {
          const game = gamesByAreaInRound[areaIdx]?.[slot];
          if (game) {
            row[`area${areaIdx + 1}Team1`] = game.teams[0];
            row[`area${areaIdx + 1}Team2`] = game.teams[1];
            // Optionally, add game.id if needed for display or keys
            // row[`area${areaIdx + 1}GameId`] = game.id;
          } else {
            row[`area${areaIdx + 1}Team1`] = ''; // Placeholder for empty slot
            row[`area${areaIdx + 1}Team2`] = '';
          }
        }
        transformedRows.push(row);
      }
    });

    return transformedRows;
  };

  const renderScheduleDetails = (scheduleData: Schedule, title: string) => (
    <div style={sectionStyle}>
      <h3>{title}</h3>
      <p>Type: {scheduleData.type}</p>
      <p>Games: {scheduleData.games}</p>
      {scheduleData.areas && <p>Areas: {scheduleData.areas}</p>}
    </div>
  );

  // New renderFullSchedule function
  const renderFullSchedule = (
    scheduleData: Game[] | Game[][],
    actualAreas: number, // New parameter: results.tourneySchedule.areas
    horizontalCombine: boolean,
  ) => {
    if (!scheduleData || scheduleData.length === 0) {
      return <p>No games in this schedule.</p>;
    }

    // Style for table (can be adjusted later)
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

    const renderTableForGames = (games: Game[], areaTitle?: string) => {
      if (games.length === 0) {
        return <p>No games scheduled {areaTitle ? `for ${areaTitle}` : ''}.</p>;
      }
      return (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Round</th>
              <th style={thStyle}>Game ID</th>
              <th style={thStyle}>Team 1 (Black)</th>
              <th style={thStyle}>Team 2 (White)</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, index) => (
              <tr key={`${game.id}-${index}`}>
                <td style={tdStyle}>{game.round}</td>
                <td style={tdStyle}>{game.id}</td>
                <td style={tdStyle}>{game.teams[0]}</td>
                <td style={tdStyle}>{game.teams[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    // Case 1: Horizontal Combined View for multiple areas
    if (horizontalCombine && actualAreas > 1 && Array.isArray(scheduleData) && scheduleData.length > 0 && Array.isArray(scheduleData[0])) {
      const transformedData = transformScheduleToHorizontal(scheduleData as Game[][], actualAreas);

      if (transformedData.length === 0) {
        return <p>No games to display in combined horizontal view.</p>;
      }

      // Dynamically create headers
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
    }

    // Case 2: Single actual area or schedule is already flat (Game[])
    // Or when horizontalCombine is false (default view for multiple areas)
    if (actualAreas === 1 || !Array.isArray(scheduleData[0]) || !horizontalCombine) {
      if (actualAreas > 1 && !horizontalCombine) {
        // Default view: Separate tables per area
        const scheduleByArea: Game[][] = Array.from({ length: actualAreas }, () => []);
        const gameGroups = scheduleData as Game[][]; // Game[Round][GameInRoundForArea]

        // This logic assumes gameGroups[round][gameIdx] where gameIdx maps to area for that slot in the round.
        // The original per-area display logic:
        gameGroups.forEach((roundGameGroup) => {
            roundGameGroup.forEach((game, gameIndexInGroup) => {
                // Determine area for this game. The generator usually makes games like R1A1G1, R1A2G1 for a round.
                // So, gameIndexInGroup % actualAreas gives the area index.
                const areaIdx = gameIndexInGroup % actualAreas;
                if (areaIdx < actualAreas) { // Should always be true
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
                {renderTableForGames(areaSchedule, `Area ${areaIndex + 1}`)}
              </div>
            ))}
          </div>
        );
      }

      // Single area or already flat (e.g. results.schedule is Game[])
      const games = (Array.isArray(scheduleData[0])
        ? (scheduleData as Game[][]).flat() // Flatten if it's Game[][] but actualAreas is 1
        : scheduleData) as Game[]; // Already Game[]

      return (
        <div>
          <h4>Full Game Schedule {actualAreas === 1 ? '(Single Area)' : ''}</h4>
          {renderTableForGames(games)}
        </div>
      );
    }

    // Fallback if none of the conditions are met (should not happen with proper inputs)
    return <p>Unable to render schedule. Please check data.</p>;
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Results</h2>
      <div style={sectionStyle}>
        <h3>Overall</h3>
        <p>Total Time Needed: {formatTime(results.timeNeededMinutes)}</p>
      </div>
      {renderScheduleDetails(results.tourneySchedule, 'Tournament Schedule')}
      {renderScheduleDetails(results.playoffSchedule, 'Playoff Schedule')}
      <div style={sectionStyle}>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showHorizontalCombinedView}
              onChange={(e) => setShowHorizontalCombinedView(e.target.checked)}
              disabled={(results?.tourneySchedule?.areas || 1) <= 1} // Disable if only one area
            />
            Show Combined Horizontal View
          </label>
        </div>
        {renderFullSchedule(
          results.schedule,
          results.tourneySchedule.areas || 1,
          showHorizontalCombinedView,
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
