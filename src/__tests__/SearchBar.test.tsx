import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '@/components/library/SearchBar';

describe('SearchBar Component', () => {
  it('renders the search input', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search playbooks...')).toBeInTheDocument();
  });

  it('has an accessible label', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Search playbooks')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<SearchBar value="rain" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('rain')).toBeInTheDocument();
  });

  it('calls onChange when text is entered', () => {
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText('Search playbooks...'), {
      target: { value: 'test' },
    });
    expect(onChange).toHaveBeenCalledWith('test');
  });

  it('renders with empty value', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });
});
