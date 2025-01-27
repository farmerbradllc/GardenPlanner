import React from 'react';

const PlantSelector: React.FC<{ filteredPlants: any[], onPlantSelect: (plant: any) => void }> = ({ filteredPlants, onPlantSelect }) => {
  // Add a print-specific CSS class
  const printStyles = `
    @media print {
      .print-layout {
        width: 8.5in;
        height: 11in;
        margin: 0;
        padding: 0.5in;
        page-break-after: always;
      }
      .garden-layout {
        max-width: 100%;
        margin-bottom: 0.5in;
      }
      .plant-list {
        column-count: 2;
        column-gap: 0.5in;
      }
    }
  `;

  // Update the return statement to include both layout and plant list
  return (
    <div role="region" aria-label="Plant Selection">
      <style>{printStyles}</style>
      <div className="print-layout">
        <div className="garden-layout">
          {/* Your existing garden layout component */}
        </div>
        <div className="plant-list">
          {filteredPlants.map((plant) => (
            <button
              key={plant.scientificName}
              onClick={() => onPlantSelect(plant)}
              className="p-4 border rounded hover:bg-gray-100"
              role="option"
            >
              <h3 className="font-bold">{plant.name}</h3>
              <p className="text-sm italic">{plant.scientificName}</p>
              <p className="text-sm mt-1">{plant.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlantSelector;