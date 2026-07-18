import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InsightsPanel } from '@/components/analytics/InsightsPanel';

describe('InsightsPanel Component', () => {
  it('renders the heading', () => {
    render(<InsightsPanel />);
    expect(screen.getByText('Key Insights')).toBeInTheDocument();
  });

  it('renders both insights', () => {
    render(<InsightsPanel />);
    expect(screen.getByText('Top Incident Trigger')).toBeInTheDocument();
    expect(screen.getByText('Top Operational Remedy')).toBeInTheDocument();
  });

  it('renders insight titles', () => {
    render(<InsightsPanel />);
    expect(screen.getByText('Heavy rain causing food court congestion')).toBeInTheDocument();
    expect(screen.getByText('Offline validation switch')).toBeInTheDocument();
  });

  it('renders insight descriptions', () => {
    render(<InsightsPanel />);
    expect(screen.getByText(/Occurred 4 times across/)).toBeInTheDocument();
    expect(screen.getByText(/Used during gate entry jams/)).toBeInTheDocument();
  });
});
