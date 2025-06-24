import React from 'react';
import { Game } from '@lib/tourney-time'; // Assuming Game type is available here

interface GameTableProps {
  games: Game[];
  areaTitle?: string;
}

// Styles moved from ResultsDisplay.tsx
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

const GameTable: React.FC<GameTableProps> = ({ games, areaTitle }) => {
  if (!games || games.length === 0) {
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
          // Using game.id and index for key to ensure uniqueness if ids are not globally unique for some reason
          // Though game.id should ideally be unique enough.
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

export default GameTable;
