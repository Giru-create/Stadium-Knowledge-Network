import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { Skeleton, StatCardSkeleton, PlaybookCardSkeleton, RecommendationSkeleton } from '@/components/ui/Skeleton';

describe('LoadingSkeleton (ui)', () => {
  it('renders with role="status"', () => {
    render(<LoadingSkeleton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-label="Loading"', () => {
    render(<LoadingSkeleton />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});

describe('Skeleton (ui)', () => {
  it('renders with aria-hidden="true"', () => {
    render(<Skeleton className="h-4 w-4" />);
    const el = document.querySelector('[aria-hidden="true"]');
    expect(el).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-skeleton" />);
    expect(container.firstChild).toHaveClass('custom-skeleton');
  });
});

describe('StatCardSkeleton', () => {
  it('renders without errors', () => {
    const { container } = render(<StatCardSkeleton />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe('PlaybookCardSkeleton', () => {
  it('renders without errors', () => {
    const { container } = render(<PlaybookCardSkeleton />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe('RecommendationSkeleton', () => {
  it('renders without errors', () => {
    const { container } = render(<RecommendationSkeleton />);
    expect(container.firstChild).toBeTruthy();
  });
});
