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
  // Hooks and calculations that depend on props should be at the top.
  const hasBackToBackGames = React.useMemo(() => {
    if (!scheduleData || scheduleData.length === 0) {
      return false;
    }
    if (Array.isArray(scheduleData[0])) {
      return (scheduleData as Game[][]).some(block =>
        block.some(game => game.backToBackTeams && game.backToBackTeams.length > 0)
      );
    } else {
      return (scheduleData as Game[]).some(
        game => game.backToBackTeams && game.backToBackTeams.length > 0
      );
    }
  }, [scheduleData]);

  // This calculation depends on scheduleData, so it's fine after the hook,
  // but before the early return that checks scheduleData.
  const canShowCombinedView =
    scheduleData && scheduleData.length > 0 && actualAreas > 1 &&
    Array.isArray(scheduleData) && Array.isArray(scheduleData[0]);

  if (!scheduleData || scheduleData.length === 0) {
    // This check could also be inside the sub-components, but doing it early here
    // avoids rendering the toggle and section if there's nothing to show.
    return (
        <div style={sectionStyle}>
            <p>No games in this schedule.</p>
        </div>
    );
  }

  const messageStyle: React.CSSProperties = {
    color: '#D8000C',
    backgroundColor: '#FFD2D2',
    border: '1px solid #FFBABA',
    padding: '10px',
    marginTop: '0px',
    marginBottom: '15px',
    borderRadius: '4px',
    textAlign: 'center',
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
            disabled={numAreasForToggle <= 1 || !canShowCombinedView}
          />
          Show Combined Horizontal View
        </label>
      </div>

      {showHorizontalCombinedView && canShowCombinedView ? (
        <HorizontalCombinedView
          scheduleData={scheduleData as Game[][]}
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
