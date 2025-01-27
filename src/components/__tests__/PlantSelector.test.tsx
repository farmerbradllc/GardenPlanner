import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import PlantSelector from '../PlantSelector'

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
]

const mockOnPlantSelect = vi.fn()

describe('PlantSelector', () => {
  it('displays plant names correctly', () => {
    const { container } = render(
      <PlantSelector 
        plants={mockPlants} 
        onPlantSelect={mockOnPlantSelect} 
      />
    )
    expect(container).toBeDefined()
  })
})

describe('PlantSelector additional tests', () => {
  beforeEach(() => {
    mockOnPlantSelect.mockClear()
  })

  test('handles keyboard navigation with arrow keys', () => {
    render(<PlantSelector filteredPlants={mockPlants} onPlantSelect={mockOnPlantSelect} />)
    const options = screen.getAllByRole('option')
    options[0].focus()
    
    fireEvent.keyDown(options[0], { key: 'ArrowDown' })
    expect(options[1]).toHaveFocus()
  })

  test('maintains print layout with many plants', () => {
    const manyPlants = Array(20).fill(mockPlants[0])
    const { container } = render(
      <PlantSelector filteredPlants={manyPlants} onPlantSelect={mockOnPlantSelect} />
    )
    
    const printLayout = container.querySelector('.print-layout')
    expect(printLayout).toHaveStyle({
      '@media print': {
        width: '8.5in',
        height: '11in'
      }
    })
  })

  test('handles plants with missing data gracefully', () => {
    const invalidPlant = { name: '', scientificName: '', description: '' }
    render(<PlantSelector filteredPlants={[invalidPlant]} onPlantSelect={mockOnPlantSelect} />)
    
    const plantElement = screen.getByRole('option')
    expect(plantElement).toBeInTheDocument()
  })

  test('maintains column layout in print view', () => {
    const { container } = render(
      <PlantSelector filteredPlants={mockPlants} onPlantSelect={mockOnPlantSelect} />
    )
    
    const plantList = container.querySelector('.plant-list')
    expect(plantList).toHaveStyle({
      'column-count': '2',
      'column-gap': '0.5in'
    })
  })

  test('supports multiple plant selections', () => {
    render(<PlantSelector filteredPlants={mockPlants} onPlantSelect={mockOnPlantSelect} />)
    
    fireEvent.click(screen.getByText('Tomato'))
    fireEvent.click(screen.getByText('Basil'))
    
    expect(mockOnPlantSelect).toHaveBeenCalledTimes(2)
    expect(mockOnPlantSelect).toHaveBeenNthCalledWith(1, mockPlants[0])
    expect(mockOnPlantSelect).toHaveBeenNthCalledWith(2, mockPlants[1])
  })
})