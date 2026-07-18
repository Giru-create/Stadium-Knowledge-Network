import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Match } from '@/types';

const mockMatches: Match[] = [
  {
    id: 'match-1',
    stadiumId: 's1',
    stadiumName: 'Stadium A',
    teams: { home: 'Brazil', away: 'Argentina' },
    dateTime: '2026-07-15T20:00:00Z',
    attendance: 80000,
    status: 'Live',
  },
  {
    id: 'match-2',
    stadiumId: 's2',
    stadiumName: 'Stadium B',
    teams: { home: 'Germany', away: 'France' },
    dateTime: '2026-07-16T20:00:00Z',
    attendance: 75000,
    status: 'Scheduled',
  },
];

describe('DashboardHeader Component', () => {
  it('renders the heading', () => {
    render(
      <DashboardHeader matches={mockMatches} activeMatchId="match-1" onMatchChange={vi.fn()} />
    );
    expect(screen.getByText('Operational Command')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(
      <DashboardHeader matches={mockMatches} activeMatchId="match-1" onMatchChange={vi.fn()} />
    );
    expect(screen.getByText(/Active Monitoring/)).toBeInTheDocument();
  });

  it('renders a select with all matches', () => {
    render(
      <DashboardHeader matches={mockMatches} activeMatchId="match-1" onMatchChange={vi.fn()} />
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Brazil vs Argentina (Live)')).toBeInTheDocument();
    expect(screen.getByText('Germany vs France (Scheduled)')).toBeInTheDocument();
  });

  it('calls onMatchChange when a different match is selected', () => {
    const onChange = vi.fn();
    render(
      <DashboardHeader matches={mockMatches} activeMatchId="match-1" onMatchChange={onChange} />
    );
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'match-2' } });
    expect(onChange).toHaveBeenCalledWith('match-2');
  });

  it('select has an accessible label', () => {
    render(
      <DashboardHeader matches={mockMatches} activeMatchId="match-1" onMatchChange={vi.fn()} />
    );
    expect(screen.getByLabelText('Active Match:')).toBeInTheDocument();
  });
});
