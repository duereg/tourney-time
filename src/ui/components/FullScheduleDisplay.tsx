import React from 'react';
import { Game } from '@lib/tourney-time';
import HorizontalCombinedView from './HorizontalCombinedView';
import StandardScheduleView from './StandardScheduleView';

interface FullScheduleDisplayProps {
  schedule: Game[] | Game[][];
  actualAreas: number;
  showHorizontalCombinedView: boolean;
  onToggleHorizontalView: (checked: boolean) => void;
  numAreasForToggle: number; // Used to enable/disable the toggle
}

const sectionStyle: React.CSSProperties = {
  marginTop: '15px',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
};

const FullScheduleDisplay: React.FC<FullScheduleDisplayProps> = ({
  schedule: scheduleData,
  actualAreas,
  showHorizontalCombinedView,
  onToggleHorizontalView,
  numAreasForToggle,
}) => {
  if (!scheduleData || scheduleData.length === 0) {
    // This check could also be inside the sub-components, but doing it early here
    // avoids rendering the toggle and section if there's nothing to show.
    return (
        <div style={sectionStyle}>
            <p>No games in this schedule.</p>
        </div>
    );
  }

  const canShowCombinedView = actualAreas > 1 && Array.isArray(scheduleData) && scheduleData.length > 0 && Array.isArray(scheduleData[0]);

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

  const messageStyle: React.CSSProperties = {
    color: '#D8000C', // Darker red for text for better readability
    backgroundColor: '#FFD2D2', // Light red background
    border: '1px solid #FFBABA', // Medium red border
    padding: '10px', // Increased padding slightly
    marginTop: '0px',
    marginBottom: '15px', // Increased margin slightly
    borderRadius: '4px',
    textAlign: 'center', // Center align text
  };

  return (
    <div style={sectionStyle}>
      {hasBackToBackGames && (
        <p style={messageStyle}>
          Teams highlighted in red are playing back-to-back games.
        </p>
      )}
      <div>
        <label>
          <input
            type="checkbox"
            checked={showHorizontalCombinedView}
            onChange={(e) => onToggleHorizontalView(e.target.checked)}
            // Disable toggle if not applicable (e.g., single area or data not suitable for combined view)
            disabled={numAreasForToggle <= 1 || !canShowCombinedView}
          />
          Show Combined Horizontal View
        </label>
      </div>

      {showHorizontalCombinedView && canShowCombinedView ? (
        <HorizontalCombinedView
          scheduleData={scheduleData as Game[][]} // Cast based on canShowCombinedView logic
          actualAreas={actualAreas}
        />
      ) : (
        <StandardScheduleView
          scheduleData={scheduleData}
          actualAreas={actualAreas}
        />
      )}
    </div>
  );
};

export default FullScheduleDisplay;
