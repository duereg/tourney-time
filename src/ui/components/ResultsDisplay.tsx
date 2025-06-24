import React from 'react';
import { TourneyTimeResult, Game, Schedule } from '@lib/tourney-time';
import { formatTime } from '../utils/formatTime';

interface ResultsDisplayProps {
  results: TourneyTimeResult | null;
  error: string | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, error }) => {
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
              <th style={thStyle}>Team 1</th>
              <th style={thStyle}>Team 2</th>
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

    // Case 1: Single actual area or schedule is already flat (Game[])
    if (actualAreas === 1 || !Array.isArray(scheduleData[0])) {
      const games = (Array.isArray(scheduleData[0])
        ? (scheduleData as Game[][]).flat() // Flatten if it's Game[][] but actualAreas is 1
        : scheduleData) as Game[]; // Already Game[]

      return (
        <div>
          <h4>Full Game Schedule (Single Area):</h4>
          {renderTableForGames(games)}
        </div>
      );
    }

    // Case 2: Multiple actual areas (actualAreas > 1) and scheduleData is Game[][]
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
        {renderFullSchedule(results.schedule, results.tourneySchedule.areas || 1)}
      </div>
    </div>
  );
};

export default ResultsDisplay;
