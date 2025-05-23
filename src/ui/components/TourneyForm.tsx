import React, { useState } from 'react';
import { TourneyTimeOptions } from '@lib/tourney-time'; // Assuming path alias is configured for Parcel

// Define a type for the props, including the submit handler
interface TourneyFormProps {
  // Callback to App.tsx with the form data
  onSubmit: (
    options: Omit<TourneyTimeOptions, 'teams'> & { teams: number | string },
  ) => void;
  defaultValues: Partial<TourneyTimeOptions>;
}

const TourneyForm: React.FC<TourneyFormProps> = ({
  onSubmit,
  defaultValues,
}) => {
  // State for each form field
  // Initialize with defaultValues or typical defaults if not provided
  const [teams, setTeams] = useState<string | number>(
    defaultValues.teams || '',
  ); // Allow string for input flexibility
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Convert teams to number before submitting
    const numTeams = typeof teams === 'string' ? parseInt(teams, 10) : teams;
    if (isNaN(numTeams)) {
      alert('Please enter a valid number for teams.');
      return;
    }
    onSubmit({
      teams: numTeams,
      gameTime,
      restTime,
      areas,
      playoffTime,
      playoffRestTime,
    });
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
