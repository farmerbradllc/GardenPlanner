import { render, screen, fireEvent } from '@testing-library/react';
import { PlantSelector } from '../PlantSelector';

const mockPlants = [
  {
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    description: "Red fruit vegetable"
  },
  {
    name: "Basil",
    scientificName: "Ocimum basilicum", 
    description: "Aromatic herb"
  }
];

const mockOnPlantSelect = jest.fn();

describe('PlantSelector', () => {
  beforeEach(() => {
    mockOnPlantSelect.mockClear();
  });

  test('renders plant list with correct data', () => {
    render(<PlantSelector plants={mockPlants} onPlantSelect={mockOnPlantSelect} />);
    
    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('Solanum lycopersicum')).toBeInTheDocument();
    expect(screen.getByText('Basil')).toBeInTheDocument();
  });

  test('calls onPlantSelect when plant is clicked', () => {
    render(<PlantSelector plants={mockPlants} onPlantSelect={mockOnPlantSelect} />);
    
    fireEvent.click(screen.getByText('Tomato'));
    expect(mockOnPlantSelect).toHaveBeenCalledWith(mockPlants[0]);
  });

  test('has correct print layout styles', () => {
    const { container } = render(
      <PlantSelector plants={mockPlants} onPlantSelect={mockOnPlantSelect} />
    );
    
    const styleElement = container.querySelector('style');
    expect(styleElement?.textContent).toContain('@media print');
    expect(styleElement?.textContent).toContain('width: 8.5in');
  });

  test('has correct accessibility attributes', () => {
    render(<PlantSelector plants={mockPlants} onPlantSelect={mockOnPlantSelect} />);
    
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Plant Selection');
    expect(screen.getAllByRole('option')).toHaveLength(mockPlants.length);
  });

  test('renders empty state gracefully', () => {
    render(<PlantSelector plants={[]} onPlantSelect={mockOnPlantSelect} />);
    
    const plantList = screen.getByRole('region');
    expect(plantList).toBeInTheDocument();
  });
});
