import React from 'react';
import { Schedule } from '@lib/tourney-time'; // Assuming Schedule type is available here

interface ScheduleDetailsCardProps {
  schedule: Schedule | null | undefined; // Allow null or undefined for safety
  title: string;
}

const sectionStyle: React.CSSProperties = {
  marginTop: '15px',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '4px',
};

const ScheduleDetailsCard: React.FC<ScheduleDetailsCardProps> = ({ schedule, title }) => {
  if (!schedule) {
    return (
      <div style={sectionStyle}>
        <h3>{title}</h3>
        <p>No schedule data available.</p>
      </div>
    );
  }

  return (
    <div style={sectionStyle}>
      <h3>{title}</h3>
      <p>Type: {schedule.type}</p>
      <p>Games: {schedule.games}</p>
      {schedule.areas != null && <p>Areas: {schedule.areas}</p>}
    </div>
  );
};

export default ScheduleDetailsCard;
