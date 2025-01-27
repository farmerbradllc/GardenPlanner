import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Plant, PlacedPlant, GardenBed } from '../types';
import { Wand2, X } from 'lucide-react';

interface GardenLayoutProps {
  selectedPlant: Plant | null;
  onPlantPlace: (plant: PlacedPlant) => void;
  availablePlants: Plant[];
  bed: GardenBed;
  onBedUpdate: (bed: GardenBed) => void;
}

export function GardenLayout({ selectedPlant, onPlantPlace, availablePlants, bed, onBedUpdate }: GardenLayoutProps) {
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  // Convert feet to grid cells (1 foot = 12 inches, grid cell = 3 inches)
  const gridCellsX = bed.width * 4;
  const gridCellsY = bed.height * 4;

  const isSpaceAvailable = (x: number, y: number, plantSpacing: number) => {
    const spacing = Math.ceil(plantSpacing / 3); // Convert inches to grid cells
    return !bed.plants.some(plant => {
      const existingSpacing = Math.ceil(plant.plant.spacing / 3);
      const distance = Math.sqrt(Math.pow(plant.x - x, 2) + Math.pow(plant.y - y, 2));
      return distance < (spacing + existingSpacing) / 2;
    });
  };

  const getSpacingRadius = (spacing: number) => {
    return Math.ceil(spacing / 3); // Convert inches to grid cells
  };

  const isWithinSpacingRadius = (x: number, y: number, centerX: number, centerY: number, radius: number) => {
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    return distance <= radius;
  };

  const handleCellClick = (x: number, y: number) => {
    // Check if there's already a plant at this location
    const existingPlant = bed.plants.find(p => p.x === x && p.y === y);
    if (existingPlant) {
      // Remove the plant if clicked
      const updatedBed = {
        ...bed,
        plants: bed.plants.filter(p => p !== existingPlant)
      };
      onBedUpdate(updatedBed);
      return;
    }

    if (!selectedPlant) return;
    if (isSpaceAvailable(x, y, selectedPlant.spacing)) {
      const newPlant: PlacedPlant = { plant: selectedPlant, x, y };
      const updatedBed = {
        ...bed,
        plants: [...bed.plants, newPlant]
      };
      onBedUpdate(updatedBed);
      onPlantPlace(newPlant);
    }
  };

  const autoPlacePlants = () => {
    const newBed = { ...bed, plants: [] };
    const plantsToPlace = [...availablePlants].sort((a, b) => b.spacing - a.spacing);
    
    // Create a grid to track occupied spaces
    const occupied = Array(gridCellsY).fill(0).map(() => Array(gridCellsX).fill(false));

    for (const plant of plantsToPlace) {
      const spacing = Math.ceil(plant.spacing / 3);
      
      // Try to place multiple instances of each plant
      let attempts = 3; // Number of each plant to try placing
      
      for (let attempt = 0; attempt < attempts; attempt++) {
        // Scan the grid for available spaces
        for (let y = spacing; y < gridCellsY - spacing; y += 2) {
          for (let x = spacing; x < gridCellsX - spacing; x += 2) {
            if (isSpaceAvailable(x, y, plant.spacing) && !occupied[y][x]) {
              // Place the plant
              const newPlant: PlacedPlant = { plant, x, y };
              newBed.plants.push(newPlant);
              
              // Mark the area as occupied
              for (let dy = -spacing; dy <= spacing; dy++) {
                for (let dx = -spacing; dx <= spacing; dx++) {
                  const ny = y + dy;
                  const nx = x + dx;
                  if (ny >= 0 && ny < gridCellsY && nx >= 0 && nx < gridCellsX) {
                    occupied[ny][nx] = true;
                  }
                }
              }
              
              break;
            }
          }
        }
      }
    }

    onBedUpdate(newBed);
    newBed.plants.forEach(onPlantPlace);
  };

  const clearLayout = () => {
    onBedUpdate({ ...bed, plants: [] });
  };

  const getCellClassName = (x: number, y: number) => {
    const placedPlant = bed.plants.find(p => p.x === x && p.y === y);
    const isHovered = hoverPosition && x === hoverPosition.x && y === hoverPosition.y;
    
    let classes = 'w-6 h-6 flex items-center justify-center relative transition-all duration-200 ';

    if (placedPlant) {
      classes += 'bg-green-100 hover:bg-red-100 cursor-pointer ';
      
      // Show remove icon on hover
      if (isHovered) {
        classes += 'plant-cell-hover ';
      }
    } else {
      classes += 'bg-white ';
      
      if (selectedPlant && hoverPosition) {
        const spacing = getSpacingRadius(selectedPlant.spacing);
        
        // Check if this cell is within the spacing radius of the hovered position
        if (isWithinSpacingRadius(x, y, hoverPosition.x, hoverPosition.y, spacing)) {
          if (isSpaceAvailable(hoverPosition.x, hoverPosition.y, selectedPlant.spacing)) {
            classes += 'bg-green-50 ';
          } else {
            classes += 'bg-red-50 ';
          }
        }
      }
      
      if (selectedPlant) {
        classes += 'cursor-pointer hover:bg-green-50 ';
      }
    }

    return classes;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{bed.name}</h3>
        <div className="space-x-2">
          <button
            onClick={autoPlacePlants}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Auto-arrange
          </button>
          <button
            onClick={clearLayout}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {selectedPlant 
            ? `Placing ${selectedPlant.name} (${selectedPlant.spacing}" spacing) - Click to place, hover to see spacing`
            : 'Select a plant from the list to begin placing. Click placed plants to remove them.'}
        </p>
      </div>
      <div 
        className="border-2 border-green-800 rounded-lg overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCellsX}, 1.5rem)`,
          gridTemplateRows: `repeat(${gridCellsY}, 1.5rem)`,
          gap: '1px',
          background: '#e5e7eb'
        }}
      >
        {Array.from({ length: gridCellsY }).map((_, y) =>
          Array.from({ length: gridCellsX }).map((_, x) => {
            const placedPlant = bed.plants.find(p => p.x === x && p.y === y);
            const Icon = placedPlant ? Icons[placedPlant.plant.icon as keyof typeof Icons] : null;

            return (
              <div
                key={`${x}-${y}`}
                onClick={() => handleCellClick(x, y)}
                onMouseEnter={() => setHoverPosition({ x, y })}
                onMouseLeave={() => setHoverPosition(null)}
                className={getCellClassName(x, y)}
              >
                {Icon && <Icon className="w-4 h-4 text-green-600" />}
                {placedPlant && hoverPosition?.x === x && hoverPosition?.y === y && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-50">
                    <X className="w-4 h-4 text-red-600" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Garden Bed Size: {bed.width}' × {bed.height}'</p>
        <p>Plants placed: {bed.plants.length}</p>
      </div>
      <style>
        {`
          .plant-cell-hover::after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(239, 68, 68, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
}