import { describe, it, expect } from 'vitest';
import { ResourceCard } from '@/components/library/ResourceCard';
import { render, screen, fireEvent } from '@testing-library/react';
import { Playbook } from '@/types';

const mockPlaybook: Playbook = {
  id: 'pb-1',
  title: 'Heavy Rain Emergency Protocol for Stadium Operations',
  eventType: 'Heavy Rain',
  stadiumId: 's1',
  stadiumName: 'Test Stadium',
  problem: 'Heavy rainfall causing crowd congestion',
  rootCause: 'Weather',
  operationalRisk: 'Safety',
  recommendedActions: ['Open gates'],
  expectedImpact: 'Better flow',
  lessonsLearned: 'Monitor weather',
  confidenceScore: 92,
  alternativeStrategy: 'Backup',
  createdAt: '2026-07-15T10:00:00.000Z',
};

describe('ResourceCard Component', () => {
  it('renders playbook title', () => {
    render(<ResourceCard playbook={mockPlaybook} onInspect={vi.fn()} />);
    expect(screen.getByText(/Heavy Rain Emergency Protocol/)).toBeInTheDocument();
  });

  it('renders event type badge', () => {
    render(<ResourceCard playbook={mockPlaybook} onInspect={vi.fn()} />);
    expect(screen.getByText('Heavy Rain')).toBeInTheDocument();
  });

  it('renders confidence score', () => {
    render(<ResourceCard playbook={mockPlaybook} onInspect={vi.fn()} />);
    expect(screen.getByText(/92% Confidence/)).toBeInTheDocument();
  });

  it('renders stadium name', () => {
    render(<ResourceCard playbook={mockPlaybook} onInspect={vi.fn()} />);
    expect(screen.getByText(/Test Stadium/)).toBeInTheDocument();
  });

  it('renders problem summary', () => {
    render(<ResourceCard playbook={mockPlaybook} onInspect={vi.fn()} />);
    expect(screen.getByText(/Heavy rainfall causing crowd congestion/)).toBeInTheDocument();
  });

  it('calls onInspect when Inspect SOP is clicked', () => {
    const onInspect = vi.fn();
    render(<ResourceCard playbook={mockPlaybook} onInspect={onInspect} />);
    fireEvent.click(screen.getByText('Inspect SOP'));
    expect(onInspect).toHaveBeenCalledWith(mockPlaybook);
  });

  it('renders the inspect button', () => {
    render(<ResourceCard playbook={mockPlaybook} onInspect={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Inspect SOP/i })).toBeInTheDocument();
  });
});

import { vi } from 'vitest';
