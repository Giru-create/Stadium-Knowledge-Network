import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

describe('Card Component', () => {
  it('renders Card with children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Card className="custom-class">Test</Card>);
    expect(screen.getByText('Test').closest('div')?.className).toContain('custom-class');
  });

  it('renders CardHeader', () => {
    render(<Card><CardHeader>Header content</CardHeader></Card>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('renders CardTitle', () => {
    render(<Card><CardHeader><CardTitle>Title Text</CardTitle></CardHeader></Card>);
    expect(screen.getByText('Title Text')).toBeInTheDocument();
  });

  it('renders CardDescription', () => {
    render(<Card><CardHeader><CardDescription>Description text</CardDescription></CardHeader></Card>);
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('renders CardContent', () => {
    render(<Card><CardContent>Content area</CardContent></Card>);
    expect(screen.getByText('Content area')).toBeInTheDocument();
  });

  it('renders CardFooter', () => {
    render(<Card><CardFooter>Footer area</CardFooter></Card>);
    expect(screen.getByText('Footer area')).toBeInTheDocument();
  });

  it('renders all sub-components together', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Full Title</CardTitle>
          <CardDescription>Full Description</CardDescription>
        </CardHeader>
        <CardContent>Full Content</CardContent>
        <CardFooter>Full Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText('Full Title')).toBeInTheDocument();
    expect(screen.getByText('Full Description')).toBeInTheDocument();
    expect(screen.getByText('Full Content')).toBeInTheDocument();
    expect(screen.getByText('Full Footer')).toBeInTheDocument();
  });
});
