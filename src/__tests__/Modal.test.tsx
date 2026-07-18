import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '@/components/ui/Modal';

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal Title',
    children: <p>Modal content here</p>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
    expect(screen.getByText('Modal content here')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Test Modal Title')).not.toBeInTheDocument();
  });

  it('has role="dialog" attribute', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has aria-modal="true"', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-labelledby pointing to title', () => {
    render(<Modal {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    const titleId = dialog.getAttribute('aria-labelledby');
    expect(titleId).toBeTruthy();
    const titleEl = document.getElementById(titleId!);
    expect(titleEl?.textContent).toBe('Test Modal Title');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    const closeBtn = screen.getByLabelText('Close dialog');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('close button has aria-label', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });

  it('renders different sizes', () => {
    const { rerender } = render(<Modal {...defaultProps} size="md" />);
    expect(screen.getByRole('dialog').className).toContain('max-w-xl');

    rerender(<Modal {...defaultProps} size="lg" />);
    expect(screen.getByRole('dialog').className).toContain('max-w-3xl');

    rerender(<Modal {...defaultProps} size="xl" />);
    expect(screen.getByRole('dialog').className).toContain('max-w-5xl');
  });

  it('renders children content', () => {
    render(
      <Modal {...defaultProps}>
        <div>
          <input type="text" placeholder="Test input" />
          <button>Test button</button>
        </div>
      </Modal>
    );
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument();
    expect(screen.getByText('Test button')).toBeInTheDocument();
  });
});
