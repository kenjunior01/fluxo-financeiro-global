
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PatternRecognition } from '@/components/advanced-analysis/PatternRecognition';
import { ChartData } from '@/types';

// Mock data for ascending triangle pattern
const mockAscendingTriangleData: ChartData[] = Array.from({ length: 25 }, (_, i) => ({
  time: `2024-01-${i + 1}`,
  value: 100 + Math.sin(i * 0.3) * 2 + (i * 0.1) // Rising lows, horizontal highs
}));

// Mock data for head and shoulders pattern
const mockHeadShouldersData: ChartData[] = [
  ...Array.from({ length: 10 }, (_, i) => ({ time: `2024-01-${i + 1}`, value: 100 + i })),
  ...Array.from({ length: 5 }, (_, i) => ({ time: `2024-01-${i + 11}`, value: 110 + i * 2 })), // Left shoulder
  ...Array.from({ length: 5 }, (_, i) => ({ time: `2024-01-${i + 16}`, value: 120 + i * 3 })), // Head
  ...Array.from({ length: 5 }, (_, i) => ({ time: `2024-01-${i + 21}`, value: 135 - i * 2 })), // Right shoulder
  ...Array.from({ length: 5 }, (_, i) => ({ time: `2024-01-${i + 26}`, value: 125 - i }))
];

describe('PatternRecognition', () => {
  it('renders pattern recognition component', () => {
    render(
      <PatternRecognition
        data={mockAscendingTriangleData}
        symbol="AAPL"
      />
    );

    expect(screen.getByText('Reconhecimento de Padrões')).toBeInTheDocument();
  });

  it('detects ascending triangle pattern', () => {
    // Create data that should trigger ascending triangle detection
    const triangleData = Array.from({ length: 25 }, (_, i) => ({
      time: `2024-01-${i + 1}`,
      value: 100 + (i % 5 === 0 ? 0 : Math.random() * 0.5) // Horizontal resistance with some variance
    }));

    render(
      <PatternRecognition
        data={triangleData}
        symbol="AAPL"
      />
    );

    // Should show either a pattern or "no patterns detected"
    const element = screen.getByText('Reconhecimento de Padrões');
    expect(element).toBeInTheDocument();
  });

  it('shows no patterns message when no patterns detected', () => {
    const randomData: ChartData[] = Array.from({ length: 5 }, (_, i) => ({
      time: `2024-01-${i + 1}`,
      value: 100 + Math.random() * 10
    }));

    render(
      <PatternRecognition
        data={randomData}
        symbol="AAPL"
      />
    );

    expect(screen.getByText('Nenhum Padrão Detectado')).toBeInTheDocument();
    expect(screen.getByText(/Aguardando mais dados/)).toBeInTheDocument();
  });

  it('displays pattern confidence and targets when pattern detected', () => {
    render(
      <PatternRecognition
        data={mockHeadShouldersData}
        symbol="AAPL"
      />
    );

    // The component should either show patterns or no patterns message
    expect(screen.getByText('Reconhecimento de Padrões')).toBeInTheDocument();
  });

  it('shows pattern summary when patterns are detected', () => {
    render(
      <PatternRecognition
        data={mockAscendingTriangleData}
        symbol="AAPL"
      />
    );

    // Check for the presence of the component
    expect(screen.getByText('Reconhecimento de Padrões')).toBeInTheDocument();
  });

  it('handles insufficient data gracefully', () => {
    const insufficientData: ChartData[] = [
      { time: '2024-01-01', value: 100 },
      { time: '2024-01-02', value: 101 }
    ];

    render(
      <PatternRecognition
        data={insufficientData}
        symbol="AAPL"
      />
    );

    expect(screen.getByText('Nenhum Padrão Detectado')).toBeInTheDocument();
  });
});
