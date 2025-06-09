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

    // Style for preformatted game lists (can keep existing preStyle)
    // const preStyle: React.CSSProperties = { // preStyle is already defined in the component scope
    //   backgroundColor: '#f4f4f4',
    //   border: '1px solid #ddd',
    //   padding: '10px',
    //   overflowX: 'auto',
    //   maxHeight: '400px',
    // };

    // Case 1: Single actual area or schedule is already flat (Game[])
    if (actualAreas === 1 || !Array.isArray(scheduleData[0])) {
      const games = (Array.isArray(scheduleData[0])
        ? (scheduleData as Game[][]).flat() // Flatten if it's Game[][] but actualAreas is 1
        : scheduleData) as Game[]; // Already Game[]

      return (
        <div>
          <h4>Full Game Schedule (Single Area):</h4>
          {games.length > 0 ? (
            <pre style={preStyle}>
              {games
                .map(
                  (game) =>
                    `Round ${game.round}, Game ${game.id}: ${game.teams.join(' vs ')}`,
                )
                .join('\n')}
            </pre>
          ) : (
            <p>No games scheduled for this area.</p>
          )}
        </div>
      );
    }

    // Case 2: Multiple actual areas (actualAreas > 1) and scheduleData is Game[][]
    const scheduleByArea: Game[][] = Array.from({ length: actualAreas }, () => []);
    const gameGroups = scheduleData as Game[][];

    gameGroups.forEach((group) => {
      group.forEach((game, gameIndexInGroup) => {
        // Assign game to an area. gameIndexInGroup corresponds to the area index (0-based)
        // within that concurrent block of games.
        if (gameIndexInGroup < actualAreas) {
          scheduleByArea[gameIndexInGroup].push(game);
        }
        // If a group has more games than actualAreas (e.g. pods scheduling),
        // those extra games are currently ignored by this logic for per-area display.
      });
    });

    return (
      <div>
        <h4>Full Game Schedule (Per Area):</h4>
        {scheduleByArea.map((areaSchedule, areaIndex) => (
          <div key={areaIndex} style={{ marginBottom: '10px' }}>
            <h5>Schedule for Area {areaIndex + 1}</h5>
            {areaSchedule.length > 0 ? (
              <pre style={preStyle}>
                {areaSchedule
                  .map(
                    (game) =>
                      `  Round ${game.round}, Game ${game.id}: ${game.teams.join(' vs ')}`,
                  )
                  .join('\n')}
              </pre>
            ) : (
              <p>No games scheduled for this area.</p>
            )}
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
