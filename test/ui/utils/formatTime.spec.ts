import { expect } from 'chai';
import { formatTime } from '../../../src/ui/utils/formatTime';

describe('formatTime', () => {
  it('should return "0 minutes" for 0 input', () => {
    expect(formatTime(0)).to.equal('0 minutes');
  });

  it('should format times less than an hour correctly', () => {
    expect(formatTime(30)).to.equal('30 minutes');
    expect(formatTime(1)).to.equal('1 minute');
    expect(formatTime(59)).to.equal('59 minutes');
  });

  it('should format times less than a day correctly', () => {
    expect(formatTime(60)).to.equal('1 hour');
    expect(formatTime(90)).to.equal('1 hour 30 minutes');
    expect(formatTime(120)).to.equal('2 hours');
    expect(formatTime(1439)).to.equal('23 hours 59 minutes'); // 24 * 60 - 1
  });

  it('should format times including days correctly', () => {
    expect(formatTime(1440)).to.equal('1 day'); // 24 * 60
    expect(formatTime(1500)).to.equal('1 day 1 hour'); // 24 * 60 + 60
    expect(formatTime(1530)).to.equal('1 day 1 hour 30 minutes');
    expect(formatTime(2880)).to.equal('2 days'); // 2 * 24 * 60
    expect(formatTime(2910)).to.equal('2 days 30 minutes');
    expect(formatTime(2940)).to.equal('2 days 1 hour');
  });

  it('should handle pluralization correctly', () => {
    expect(formatTime(1)).to.equal('1 minute');
    expect(formatTime(59)).to.equal('59 minutes');
    expect(formatTime(60)).to.equal('1 hour');
    expect(formatTime(119)).to.equal('1 hour 59 minutes');
    expect(formatTime(120)).to.equal('2 hours');
    expect(formatTime(1440)).to.equal('1 day');
    expect(formatTime(2880)).to.equal('2 days');
  });

  it('should return "Invalid input" for negative numbers', () => {
    expect(formatTime(-10)).to.equal('Invalid input');
  });

  it('should correctly format when only minutes remain implicitly', () => {
    expect(formatTime(45)).to.equal('45 minutes');
  });

  it('should correctly format when only hours and minutes are present', () => {
    expect(formatTime(75)).to.equal('1 hour 15 minutes');
  });

  it('should correctly format when only days and minutes are present', () => {
    expect(formatTime(1440 + 30)).to.equal('1 day 30 minutes'); // 1470
  });

  it('should correctly format when only days and hours are present', () => {
    expect(formatTime(1440 + 120)).to.equal('1 day 2 hours'); // 1560
  });

  it('should handle exact hour and day values correctly (no minutes part if they are zero)', () => {
    expect(formatTime(60)).to.equal('1 hour');
    expect(formatTime(120)).to.equal('2 hours');
    expect(formatTime(1440)).to.equal('1 day');
    expect(formatTime(2880)).to.equal('2 days');
    expect(formatTime(1440 + 60 * 2)).to.equal('1 day 2 hours');
  });
});
