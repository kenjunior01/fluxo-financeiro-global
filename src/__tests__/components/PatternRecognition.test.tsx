
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { describe, it, expect } from 'vitest';
import { PatternRecognition } from '@/components/advanced-analysis/PatternRecognition';

// Mock data for testing
const mockData = [
  { time: '2024-01-01', value: 100 },
  { time: '2024-01-02', value: 102 },
  { time: '2024-01-03', value: 98 },
  { time: '2024-01-04', value: 105 },
  { time: '2024-01-05', value: 107 },
];

describe('PatternRecognition', () => {
  it('renders without crashing', () => {
    render(<PatternRecognition data={mockData} symbol="AAPL" />);
    expect(screen.getByText('Reconhecimento de Padrões')).toBeInTheDocument();
  });

  it('displays pattern analysis section', () => {
    render(<PatternRecognition data={mockData} symbol="AAPL" />);
    expect(screen.getByText('Análise de Padrões')).toBeInTheDocument();
  });

  it('shows detected patterns', () => {
    render(<PatternRecognition data={mockData} symbol="AAPL" />);
    
    // Check if some patterns are displayed
    expect(screen.getByText('Triângulo Ascendente')).toBeInTheDocument();
    expect(screen.getByText('Canal de Alta')).toBeInTheDocument();
  });

  it('displays confidence levels', () => {
    render(<PatternRecognition data={mockData} symbol="AAPL" />);
    expect(screen.getByText('Confiança: 78%')).toBeInTheDocument();
  });

  it('shows breakout alerts', () => {
    render(<PatternRecognition data={mockData} symbol="AAPL" />);
    expect(screen.getByText('Alertas de Breakout')).toBeInTheDocument();
  });

  it('displays pattern predictions', () => {
    render(<PatternRecognition data={mockData} symbol="AAPL" />);
    expect(screen.getByText('Previsões de Padrões')).toBeInTheDocument();
  });

  it('shows pattern strength indicators', () => {
    render(<PatternRecognition data={mockData} symbol="AAPL" />);
    expect(screen.getByText('Força do Padrão')).toBeInTheDocument();
  });
});
