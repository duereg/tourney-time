import React, { useState } from 'react';
import { TourneyTimeResult } from '@lib/tourney-time';
import { formatTime } from '../utils/formatTime';
import ScheduleDetailsCard from './ScheduleDetailsCard';
import FullScheduleDisplay from './FullScheduleDisplay';

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

  // sectionStyle can be defined here if it's still used by ResultsDisplay directly,
  // or moved/duplicated if specific child components need it and it's not passed.
  // For now, assuming it might be used for the "Overall" section or general layout.
  const sectionStyle: React.CSSProperties = {
    marginTop: '15px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Results</h2>
      <div style={sectionStyle}>
        <h3>Overall</h3>
        <p>Total Time Needed: {formatTime(results.timeNeededMinutes)}</p>
      </div>

      <ScheduleDetailsCard title="Tournament Schedule" schedule={results.tourneySchedule} />
      <ScheduleDetailsCard title="Playoff Schedule" schedule={results.playoffSchedule} />

      <FullScheduleDisplay
        schedule={results.schedule}
        actualAreas={results.tourneySchedule.areas || 1} // actualAreas for schedule display
        numAreasForToggle={results.tourneySchedule.areas || 1} // areas to determine if toggle is active
        showHorizontalCombinedView={showHorizontalCombinedView}
        onToggleHorizontalView={setShowHorizontalCombinedView}
      />
    </div>
  );
};

export default ResultsDisplay;
