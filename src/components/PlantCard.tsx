import React from 'react';
import * as Icons from 'lucide-react';
import { Plant } from '../types';

interface PlantCardProps {
  plant: Plant;
  onSelect: (plant: Plant) => void;
  isSelected?: boolean;
}

export function PlantCard({ plant, onSelect, isSelected }: PlantCardProps) {
  const Icon = Icons[plant.icon as keyof typeof Icons];
  
  return (
    <div 
      onClick={() => onSelect(plant)}
      className={`
        bg-white rounded-lg shadow-md p-4 cursor-pointer
        hover:shadow-lg transition-shadow
        ${isSelected ? 'ring-2 ring-green-500' : ''}
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-6 h-6 text-green-600" />
        <h3 className="font-semibold text-lg">{plant.name}</h3>
      </div>
      <p className="text-sm text-gray-600 italic mb-2">{plant.scientificName}</p>
      <p className="text-sm text-gray-700 mb-2">{plant.description}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {plant.startIndoors && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Start Indoors: {plant.startIndoors}
          </span>
        )}
        {plant.transplantOutdoors && (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Transplant: {plant.transplantOutdoors}
          </span>
        )}
        {plant.directSow && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            Direct Sow: {plant.directSow}
          </span>
        )}
      </div>
    </div>
  );
}