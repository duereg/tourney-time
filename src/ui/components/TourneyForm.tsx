import React, { useState } from 'react';
import { TourneyTimeOptions, SchedulingStrategy } from '@lib/tourney-time'; // Assuming path alias and SchedulingStrategy import

// Define a type for the props, including the submit handler
// TourneyTimeOptions already includes schedulingStrategy and numGamesPerTeam
interface TourneyFormProps {
  // Callback to App.tsx with the form data
  onSubmit: (
    options: Omit<TourneyTimeOptions, 'teams'> & { teams: number | string } // teams can be string from input
  ) => void;
  defaultValues: Partial<TourneyTimeOptions>;
}

const TourneyForm: React.FC<TourneyFormProps> = ({
  onSubmit,
  defaultValues,
}) => {
  // State for each form field
  const [teams, setTeams] = useState<string | number>(
    defaultValues.teams || '',
  );
  const [gameTime, setGameTime] = useState<number>(
    defaultValues.gameTime || 33,
  );
  const [restTime, setRestTime] = useState<number>(defaultValues.restTime || 7);
  const [areas, setAreas] = useState<number>(defaultValues.areas || 1);
  const [playoffTime, setPlayoffTime] = useState<number>(
    defaultValues.playoffTime || 33,
  );
  const [playoffRestTime, setPlayoffRestTime] = useState<number>(
    defaultValues.playoffRestTime || 12,
  );
  // New state for scheduling strategy and games per team
  const [schedulingStrategy, setSchedulingStrategy] = useState<SchedulingStrategy>(
    defaultValues.schedulingStrategy || 'round-robin',
  );
  const [numGamesPerTeam, setNumGamesPerTeam] = useState<number | ''>( // Allow empty string for input
    defaultValues.numGamesPerTeam || '',
  );


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numTeams = typeof teams === 'string' ? parseInt(teams, 10) : teams;
    if (isNaN(numTeams)) {
      alert('Please enter a valid number for teams.');
      return;
    }

    const optionsToSubmit: Omit<TourneyTimeOptions, 'teams'> & { teams: number } = {
      teams: numTeams,
      gameTime,
      restTime,
      areas,
      playoffTime,
      playoffRestTime,
      schedulingStrategy,
    };

    if (schedulingStrategy === 'partial-round-robin') {
      const games = typeof numGamesPerTeam === 'string' ? parseInt(numGamesPerTeam, 10) : numGamesPerTeam;
      if (isNaN(games) || games <= 0) {
        alert('Please enter a valid number of games per team for partial round robin.');
        return;
      }
      optionsToSubmit.numGamesPerTeam = games;
    }

    onSubmit(optionsToSubmit);
  };

  const formRowStyle: React.CSSProperties = {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  };

  const labelStyle: React.CSSProperties = {
    marginRight: '10px',
    minWidth: '150px', // Adjust as needed for alignment
  };

  const inputStyle: React.CSSProperties = {
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: '20px',
        padding: '20px',
        border: '1px solid #eee',
        borderRadius: '5px',
      }}
    >
      <h2>Tournament Options</h2>
      <div style={formRowStyle}>
        <label style={labelStyle} htmlFor="teams">
          Number of Teams:
        </label>
        <input
          style={inputStyle}
          type="number"
          id="teams"
          value={teams}
          onChange={(e) =>
            setTeams(e.target.value === '' ? '' : parseInt(e.target.value, 10))
          }
          required
          min="0"
        />
      </div>

      {/* Scheduling Strategy Dropdown */}
      <div style={formRowStyle}>
        <label style={labelStyle} htmlFor="schedulingStrategy">
          Scheduling Strategy:
        </label>
        <select
          style={inputStyle}
          id="schedulingStrategy"
          value={schedulingStrategy}
          onChange={(e) => setSchedulingStrategy(e.target.value as SchedulingStrategy)}
        >
          <option value="round-robin">Round Robin (Full)</option>
          <option value="partial-round-robin">Partial Round Robin</option>
          <option value="pods">Pods</option>
        </select>
      </div>

      {/* Conditional Input for Number of Games Per Team */}
      {schedulingStrategy === 'partial-round-robin' && (
        <div style={formRowStyle}>
          <label style={labelStyle} htmlFor="numGamesPerTeam">
            Games Per Team (Partial RR):
          </label>
          <input
            style={inputStyle}
            type="number"
            id="numGamesPerTeam"
            value={numGamesPerTeam}
            onChange={(e) =>
              setNumGamesPerTeam(e.target.value === '' ? '' : parseInt(e.target.value, 10))
            }
            min="1" // A team should play at least 1 game in partial RR
            required={schedulingStrategy === 'partial-round-robin'}
          />
        </div>
      )}

      <div style={formRowStyle}>
        <label style={labelStyle} htmlFor="gameTime">
          Game Time (min):
        </label>
        <input
          style={inputStyle}
          type="number"
          id="gameTime"
          value={gameTime}
          onChange={(e) => setGameTime(parseInt(e.target.value, 10))}
          required
          min="1"
        />
      </div>
      <div style={formRowStyle}>
        <label style={labelStyle} htmlFor="restTime">
          Rest Time (min):
        </label>
        <input
          style={inputStyle}
          type="number"
          id="restTime"
          value={restTime}
          onChange={(e) => setRestTime(parseInt(e.target.value, 10))}
          required
          min="0"
        />
      </div>
      <div style={formRowStyle}>
        <label style={labelStyle} htmlFor="areas">
          Playing Areas:
        </label>
        <input
          style={inputStyle}
          type="number"
          id="areas"
          value={areas}
          onChange={(e) => setAreas(parseInt(e.target.value, 10))}
          required
          min="1"
        />
      </div>
      <div style={formRowStyle}>
        <label style={labelStyle} htmlFor="playoffTime">
          Playoff Game Time (min):
        </label>
        <input
          style={inputStyle}
          type="number"
          id="playoffTime"
          value={playoffTime}
          onChange={(e) => setPlayoffTime(parseInt(e.target.value, 10))}
          required
          min="1"
        />
      </div>
      <div style={formRowStyle}>
        <label style={labelStyle} htmlFor="playoffRestTime">
          Playoff Rest Time (min):
        </label>
        <input
          style={inputStyle}
          type="number"
          id="playoffRestTime"
          value={playoffRestTime}
          onChange={(e) => setPlayoffRestTime(parseInt(e.target.value, 10))}
          required
          min="0"
        />
      </div>
      <button
        type="submit"
        style={{
          padding: '10px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Calculate Schedule
      </button>
    </form>
  );
};

export default TourneyForm;
