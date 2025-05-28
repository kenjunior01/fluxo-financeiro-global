
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { TechnicalIndicators } from '@/components/advanced-analysis/TechnicalIndicators';

// Mock data for testing
const mockData = [
  { time: '2024-01-01', value: 100 },
  { time: '2024-01-02', value: 102 },
  { time: '2024-01-03', value: 98 },
  { time: '2024-01-04', value: 105 },
  { time: '2024-01-05', value: 107 },
];

const mockSelectedIndicators = ['RSI', 'MACD'];
const mockOnToggleIndicator = () => {};

describe('TechnicalIndicators', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('renders technical indicators component', () => {
    render(
      <TechnicalIndicators
        data={mockData}
        selectedIndicators={mockSelectedIndicators}
        onToggleIndicator={mockOnToggleIndicator}
      />
    );
    
    expect(screen.getByText('Indicadores Técnicos')).toBeInTheDocument();
    expect(screen.getByText('RSI')).toBeInTheDocument();
    expect(screen.getByText('MACD')).toBeInTheDocument();
    expect(screen.getByText('Bollinger')).toBeInTheDocument();
    expect(screen.getByText('Stochastic')).toBeInTheDocument();
  });

  it('displays RSI calculation when selected', () => {
    render(
      <TechnicalIndicators
        data={mockData}
        selectedIndicators={['RSI']}
        onToggleIndicator={mockOnToggleIndicator}
      />
    );

    // Check if RSI-related elements are present
    expect(screen.getByText('RSI')).toBeInTheDocument();
    expect(screen.getByText('Consenso dos Indicadores')).toBeInTheDocument();
    expect(screen.getByText('COMPRA')).toBeInTheDocument();
    expect(screen.getByText('NEUTRO')).toBeInTheDocument();
  });

  it('displays MACD calculation when selected', () => {
    render(
      <TechnicalIndicators
        data={mockData}
        selectedIndicators={['MACD']}
        onToggleIndicator={mockOnToggleIndicator}
      />
    );
    
    expect(screen.getByText('MACD')).toBeInTheDocument();
  });

  it('displays Bollinger Bands when selected', () => {
    render(
      <TechnicalIndicators
        data={mockData}
        selectedIndicators={['Bollinger']}
        onToggleIndicator={mockOnToggleIndicator}
      />
    );
    
    expect(screen.getByText('Bollinger')).toBeInTheDocument();
  });
});
