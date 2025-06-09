import React from 'react';
import { TourneyTimeResult, Game, Schedule } from '@lib/tourney-time';

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

  const renderFullSchedule = (scheduleGames: Game[] | Game[][]) => {
    if (!scheduleGames || scheduleGames.length === 0) {
      return <p>No games in this schedule.</p>;
    }
    // Check if it's Game[][] (multi-area) or Game[] (single-area)
    const isMultiArea = Array.isArray(scheduleGames[0]);

    if (isMultiArea) {
      return (
        <div>
          <h4>Full Game Schedule (Multi-Area):</h4>
          {(scheduleGames as Game[][]).map((areaSchedule, areaIndex) => (
            <div key={areaIndex} style={{ marginBottom: '10px' }}>
              <h5>
                Area {areaIndex + 1} / Round Group {areaIndex + 1}
              </h5>
              <pre style={preStyle}>
                {areaSchedule
                  .map(
                    (game) =>
                      `  Round ${game.round}, Game ${game.id}: ${game.teams.join(' vs ')}`,
                  )
                  .join('\n')}
              </pre>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div>
          <h4>Full Game Schedule:</h4>
          <pre style={preStyle}>
            {(scheduleGames as Game[])
              .map(
                (game) =>
                  `Round ${game.round}, Game ${game.id}: ${game.teams.join(' vs ')}`,
              )
              .join('\n')}
          </pre>
        </div>
      );
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Results</h2>
      <div style={sectionStyle}>
        <h3>Overall</h3>
        <p>Total Time Needed: {results.timeNeededMinutes} minutes</p>
      </div>
      {renderScheduleDetails(results.tourneySchedule, 'Tournament Schedule')}
      {renderScheduleDetails(results.playoffSchedule, 'Playoff Schedule')}
      <div style={sectionStyle}>{renderFullSchedule(results.schedule)}</div>
    </div>
  );
};

export default ResultsDisplay;
