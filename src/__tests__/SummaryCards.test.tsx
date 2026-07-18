import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryCards } from '@/components/analytics/SummaryCards';

describe('SummaryCards Component', () => {
  it('renders three cards', () => {
    render(<SummaryCards />);
    expect(screen.getByText('Operations Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Response Mitigation')).toBeInTheDocument();
    expect(screen.getByText('Network Sharing')).toBeInTheDocument();
  });

  it('renders the metric values', () => {
    render(<SummaryCards />);
    expect(screen.getByText('42%')).toBeInTheDocument();
    expect(screen.getByText('-15 min')).toBeInTheDocument();
    expect(screen.getByText('8.4x')).toBeInTheDocument();
  });

  it('renders the card descriptions', () => {
    render(<SummaryCards />);
    expect(screen.getByText(/Reduction in crowd congestions/)).toBeInTheDocument();
    expect(screen.getByText(/Average reduction in incident/)).toBeInTheDocument();
    expect(screen.getByText(/Increase in cross-stadium/)).toBeInTheDocument();
  });
});
