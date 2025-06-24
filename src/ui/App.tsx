import React, { useState } from 'react';
import TourneyForm from './components/TourneyForm';
import ResultsDisplay from './components/ResultsDisplay';
import tourneyTime, {
  TourneyTimeOptions,
  TourneyTimeResult,
} from '../tourney-time'; // Adjust path if necessary
import './App.css';

const App: React.FC = () => {
  // State for the results and any potential errors
  const [results, setResults] = useState<TourneyTimeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Default values for the form, matching the library's defaults
  const defaultFormValues: Partial<TourneyTimeOptions> = {
    teams: 0, // Or a more typical default like 8
    gameTime: 33,
    restTime: 7,
    areas: 1,
    playoffTime: 33,
    playoffRestTime: 12,
  };

  // Handler for form submission
  const handleCalculateSchedule = (
    options: Omit<TourneyTimeOptions, 'teams'> & { teams: number | string },
  ) => {
    try {
      setError(null); // Clear previous errors
      setResults(null); // Clear previous results

      // Ensure teams is a number
      const numericTeams =
        typeof options.teams === 'string'
          ? parseInt(options.teams, 10)
          : options.teams;
      if (isNaN(numericTeams)) {
        throw new Error('Number of teams must be a valid number.');
      }

      const fullOptions: TourneyTimeOptions = {
        ...options,
        teams: numericTeams,
      };

      const calculatedResults = tourneyTime(fullOptions);
      setResults(calculatedResults);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      setResults(null);
    }
  };

  return (
    <div className="app">
      <header className="appHeader">
        <h1>Tourney Time Calculator</h1>
      </header>
      <main>
        <TourneyForm
          onSubmit={handleCalculateSchedule}
          defaultValues={defaultFormValues}
        />
        <ResultsDisplay results={results} error={error} />
      </main>
      <footer className="appFooter">
        <p>Powered by tourney-time library.</p>
      </footer>
    </div>
  );
};

export default App;
