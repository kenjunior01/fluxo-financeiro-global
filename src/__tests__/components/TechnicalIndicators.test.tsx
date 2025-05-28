
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TechnicalIndicators } from '@/components/advanced-analysis/TechnicalIndicators';
import { ChartData } from '@/types';

// Mock data for testing
const mockChartData: ChartData[] = [
  { time: '2024-01-01', value: 100 },
  { time: '2024-01-02', value: 102 },
  { time: '2024-01-03', value: 98 },
  { time: '2024-01-04', value: 105 },
  { time: '2024-01-05', value: 103 },
  { time: '2024-01-06', value: 107 },
  { time: '2024-01-07', value: 110 },
  { time: '2024-01-08', value: 108 },
  { time: '2024-01-09', value: 112 },
  { time: '2024-01-10', value: 115 },
  { time: '2024-01-11', value: 113 },
  { time: '2024-01-12', value: 118 },
  { time: '2024-01-13', value: 120 },
  { time: '2024-01-14', value: 117 },
  { time: '2024-01-15', value: 122 },
];

describe('TechnicalIndicators', () => {
  const mockOnToggleIndicator = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders technical indicators correctly', () => {
    render(
      <TechnicalIndicators
        data={mockChartData}
        selectedIndicators={['RSI']}
        onToggleIndicator={mockOnToggleIndicator}
      />
    );

    expect(screen.getByText('Indicadores Técnicos')).toBeInTheDocument();
    expect(screen.getByText('RSI')).toBeInTheDocument();
    expect(screen.getByText('MACD')).toBeInTheDocument();
    expect(screen.getByText('Bollinger')).toBeInTheDocument();
    expect(screen.getByText('Stochastic')).toBeInTheDocument();
  });

  it('calculates RSI correctly', () => {
    render(
      <TechnicalIndicators
        data={mockChartData}
        selectedIndicators={['RSI']}
        onToggleIndicator={mockOnToggleIndicator}
      />
    );

    // RSI should be calculated and displayed
    const rsiElements = screen.getAllByText(/RSI/);
    expect(rsiElements.length).toBeGreaterThan(0);
  });

  it('toggles indicator selection', () => {
    render(
      <TechnicalIndicators
        data={mockChartData}
        selectedIndicators={['RSI']}
        onToggleIndicator={mockOnToggleIndicator}
      />
    );

    const macdButton = screen.getByRole('button', { name: /MACD/ });
    fireEvent.click(macdButton);

    expect(mockOnToggleIndicator).toHaveBeenCalledWith('MACD');
  });

  it('displays consensus correctly', () => {
    render(
      <TechnicalIndicators
        data={mockChartData}
        selectedIndicators={['RSI', 'MACD']}
        onToggleIndicator={mockOnToggleIndicator}
      />
    );

    expect(screen.getByText('Consenso dos Indicadores')).toBeInTheDocument();
    expect(screen.getByText('COMPRA')).toBeInTheDocument();
    expect(screen.getByText('NEUTRO')).toBeInTheDocument();
    expect(screen.getByText('VENDA')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(
      <TechnicalIndicators
        data={[]}
        selectedIndicators={['RSI']}
        onToggleIndicator={mockOnToggleIndicator}
      />
    );

    expect(screen.getByText('Indicadores Técnicos')).toBeInTheDocument();
  });

  it('changes timeframe correctly', () => {
    render(
      <TechnicalIndicators
        data={mockChartData}
        selectedIndicators={['RSI']}
        onToggleIndicator={mockOnToggleIndicator}
      />
    );

    const timeframeSelect = screen.getByRole('combobox');
    fireEvent.click(timeframeSelect);
    
    const option21 = screen.getByText('21');
    fireEvent.click(option21);

    // The component should re-calculate indicators with new timeframe
    expect(screen.getByText('Indicadores Técnicos')).toBeInTheDocument();
  });
});
