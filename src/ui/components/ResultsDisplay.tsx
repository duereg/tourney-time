import React, { useState } from 'react';
import { TourneyTimeResult, Game, Schedule } from '@lib/tourney-time';
import { formatTime } from '../utils/formatTime';

interface ResultsDisplayProps {
  results: TourneyTimeResult | null;
  error: string | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, error }) => {
  const [combineSchedules, setCombineSchedules] = useState(false);

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
    combine: boolean,
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

    // Case 1: Single actual area, schedule is already flat (Game[]), or not combining
    if (actualAreas === 1 || !Array.isArray(scheduleData[0]) || !combine) {
      if (actualAreas > 1 && !combine) {
        // Standard multi-area display (separate tables)
        const scheduleByArea: Game[][] = Array.from({ length: actualAreas }, () => []);
        const gameGroups = scheduleData as Game[][];

        gameGroups.forEach((group) => {
          group.forEach((game, gameIndexInGroup) => {
            if (gameIndexInGroup < actualAreas) {
              scheduleByArea[gameIndexInGroup].push(game);
            }
          });
        });

        return (
          <div>
            <h4>Full Game Schedule (Per Area):</h4>
            {scheduleByArea.map((areaSchedule, areaIndex) => (
              <div key={areaIndex} style={{ marginBottom: '20px' }}>
                <h5>Schedule for Area {areaIndex + 1}</h5>
                {renderTableForGames(areaSchedule, `Area ${areaIndex + 1}`)}
              </div>
            ))}
          </div>
        );
      }

      // Single area or already flat
      const games = (Array.isArray(scheduleData[0]) && actualAreas === 1
        ? (scheduleData as Game[][]).flat()
        : Array.isArray(scheduleData[0]) && actualAreas > 1 && combine // This case should be handled by combined logic below, but as fallback
        ? (scheduleData as Game[][]).flat() // Fallback flat
        : scheduleData) as Game[];

      return (
        <div>
          <h4>Full Game Schedule {actualAreas === 1 ? '(Single Area)' : '(Combined View - Fallback)'}:</h4>
          {renderTableForGames(games)}
        </div>
      );
    }

    // Case 2: Multiple actual areas (actualAreas > 1) and scheduleData is Game[][] and combine is true
    if (combine && actualAreas > 1 && Array.isArray(scheduleData) && scheduleData.length > 0 && Array.isArray(scheduleData[0])) {
      const combinedGames: (Game & { area: number })[] = [];
      const rounds = scheduleData as Game[][]; // Correctly typed as Game[RoundIndex][GameIndexInRound]

      // The schedule from the library is typically structured as:
      // schedule = [ round1Games[], round2Games[], ... ]
      // Each roundXGames[] contains games for that round, distributed across available areas.
      // For example, if actualAreas = 2:
      // round1Games = [gameForArea1, gameForArea2, gameForArea1_nextSlot, gameForArea2_nextSlot, ...]
      // The `game.id` often contains area info, but we can also derive it.
      // The crucial part is how games within a round are assigned to areas.
      // The original per-area display logic iterated through gameGroups (rounds)
      // then pushed game to scheduleByArea[gameIndexInGroup].push(game)
      // This implies gameIndexInGroup was directly mapping to area, which means
      // the library might produce schedule[Round][Area] directly or the old code was misinterpreting.

      // Let's re-evaluate the structure provided by `results.schedule`.
      // `results.schedule` is `Game[][]` when multiple.ts is used.
      // `multiple.ts` has `schedule[roundCounter].push(game);`
      // This means `scheduleData` is `Game[roundIndex][gameInRoundIndex]`
      // The games *within* a round are already ordered by area by the generator.
      // e.g. For 2 areas, round 1: [gameR1A1, gameR1A2, gameR1A1_2, gameR1A2_2, ...]
      // So, gameInRoundIndex = 0 is Area 1, gameInRoundIndex = 1 is Area 2,
      // gameInRoundIndex = 2 is Area 1 (next timeslot), gameInRoundIndex = 3 is Area 2 (next timeslot)

      rounds.forEach((roundGames, roundIndex) => {
        roundGames.forEach((game, gameIndexInRound) => {
          const areaForThisGame = (gameIndexInRound % actualAreas) + 1;
          combinedGames.push({
            ...game,
            round: game.round, // Ensure round from game data is used
            area: areaForThisGame,
          });
        });
      });

      // Sort combinedGames by round, then by area to ensure correct interleaving for display
      // The game object itself should have the correct 'round' property.
      // The previous loop already processes games round by round, and within each round, by area index.
      // So, additional sorting might be redundant if source data is already ordered, but good for safety.
      combinedGames.sort((a, b) => {
        if (a.round !== b.round) {
          return a.round - b.round;
        }
        return a.area - b.area;
      });

      return (
        <div>
          <h4>Full Game Schedule (Combined View)</h4>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Round</th>
                <th style={thStyle}>Area</th>
                <th style={thStyle}>Game ID</th>
                <th style={thStyle}>Team 1 (Black)</th>
                <th style={thStyle}>Team 2 (White)</th>
              </tr>
            </thead>
            <tbody>
              {combinedGames.map((game, index) => (
                <tr key={`${game.id}-${index}`}>
                  <td style={tdStyle}>{game.round}</td>
                  <td style={tdStyle}>{game.area}</td>
                  <td style={tdStyle}>{game.id}</td>
                  <td style={tdStyle}>{game.teams[0]}</td>
                  <td style={tdStyle}>{game.teams[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Fallback or other conditions (already handled above if !combine or actualAreas === 1)
    // This part should ideally not be reached if logic above is correct,
    // but acts as a safety net.
    return <p>Error in rendering schedule. Please check inputs.</p>;
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
              checked={combineSchedules}
              onChange={(e) => setCombineSchedules(e.target.checked)}
            />
            Combine schedules into one table
          </label>
        </div>
        {renderFullSchedule(
          results.schedule,
          results.tourneySchedule.areas || 1,
          combineSchedules,
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
