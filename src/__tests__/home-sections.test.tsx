import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { Footer } from '@/components/home/Footer';

describe('HeroSection Component', () => {
  it('renders the eyebrow badge', () => {
    render(<HeroSection />);
    expect(screen.getByText('Next-Gen Stadium Intelligence')).toBeInTheDocument();
  });

  it('renders the headline', () => {
    render(<HeroSection />);
    expect(screen.getByText(/Every Match Makes/)).toBeInTheDocument();
    expect(screen.getByText(/Every Stadium Smarter/)).toBeInTheDocument();
  });

  it('renders stats', () => {
    render(<HeroSection />);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('94.2%')).toBeInTheDocument();
    expect(screen.getByText('420+')).toBeInTheDocument();
  });

  it('renders stat labels', () => {
    render(<HeroSection />);
    expect(screen.getByText('Host Stadiums')).toBeInTheDocument();
    expect(screen.getByText('AI Confidence')).toBeInTheDocument();
    expect(screen.getByText('SOPs Prevented')).toBeInTheDocument();
  });
});

describe('FeaturesSection Component', () => {
  it('renders all three features', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Incident Simulation')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Library')).toBeInTheDocument();
    expect(screen.getByText('Interactive Map')).toBeInTheDocument();
  });

  it('renders feature descriptions', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Test heavy rain/)).toBeInTheDocument();
    expect(screen.getByText(/Filter, search, and sort/)).toBeInTheDocument();
    expect(screen.getByText(/Track live crowd densities/)).toBeInTheDocument();
  });
});

describe('Footer Component', () => {
  it('renders copyright', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 Stadium Knowledge Network/)).toBeInTheDocument();
  });

  it('renders utility links', () => {
    render(<Footer />);
    expect(screen.getByText('Security Policy')).toBeInTheDocument();
    expect(screen.getByText('System Status')).toBeInTheDocument();
  });

  it('renders links as anchor elements', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(2);
  });
});
