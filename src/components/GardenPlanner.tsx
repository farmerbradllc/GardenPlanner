import React, { useState } from 'react';
import { Plant, PlacedPlant, GardenBed } from '../types';
import { plants } from '../data/plants';
import { PlantCard } from './PlantCard';
import { GardenLayout } from './GardenLayout';
import { MapPin, Sun, Ruler, Clock, Plus, Printer } from 'lucide-react';

export function GardenPlanner() {
  const [zone, setZone] = useState<number>(5);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [gardenBeds, setGardenBeds] = useState<GardenBed[]>([{
    id: '1',
    name: 'Main Garden',
    width: 8,
    height: 4,
    plants: []
  }]);
  const [selectedBedId, setSelectedBedId] = useState<string>('1');
  const [showNewBedForm, setShowNewBedForm] = useState(false);
  const [newBedName, setNewBedName] = useState('');
  const [newBedWidth, setNewBedWidth] = useState(8);
  const [newBedHeight, setNewBedHeight] = useState(4);

  const filteredPlants = plants.filter(plant => plant.zones.includes(zone));
  const selectedBed = gardenBeds.find(bed => bed.id === selectedBedId)!;

  const handlePlantPlace = (plant: PlacedPlant) => {
    setGardenBeds(prev => prev.map(bed => 
      bed.id === selectedBedId 
        ? { ...bed, plants: [...bed.plants, plant] }
        : bed
    ));
  };

  const handleAddBed = (e: React.FormEvent) => {
    e.preventDefault();
    const newBed: GardenBed = {
      id: Date.now().toString(),
      name: newBedName,
      width: newBedWidth,
      height: newBedHeight,
      plants: []
    };
    setGardenBeds(prev => [...prev, newBed]);
    setSelectedBedId(newBed.id);
    setShowNewBedForm(false);
    setNewBedName('');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const style = `
      <style>
        @page { size: letter; margin: 0.5in; }
        body { font-family: Arial, sans-serif; }
        .garden-bed { page-break-after: always; }
        .garden-bed:last-child { page-break-after: avoid; }
        .grid { border: 1px solid #000; }
        .grid-cell { width: 20px; height: 20px; border: 1px solid #ccc; }
        .plant-cell { background: #e0f0e0; }
        h1 { color: #166534; }
        h2 { color: #166534; margin-top: 1rem; }
        .plant-list { margin-top: 1rem; }
        .plant-item { margin: 0.5rem 0; }
      </style>
    `;

    const content = gardenBeds.map(bed => `
      <div class="garden-bed">
        <h1>${bed.name}</h1>
        <p>Size: ${bed.width}' × ${bed.height}'</p>
        
        <h2>Plant List:</h2>
        <div class="plant-list">
          ${Array.from(new Set(bed.plants.map(p => p.plant.name))).map(plantName => {
            const count = bed.plants.filter(p => p.plant.name === plantName).length;
            const plant = plants.find(p => p.name === plantName)!;
            return `
              <div class="plant-item">
                <strong>${plantName}</strong> (${count} plants)
                ${plant.startIndoors ? `<br>Start indoors: ${plant.startIndoors}` : ''}
                ${plant.transplantOutdoors ? `<br>Transplant: ${plant.transplantOutdoors}` : ''}
                ${plant.directSow ? `<br>Direct sow: ${plant.directSow}` : ''}
                <br>Spacing: ${plant.spacing}" apart
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Garden Plan - ${new Date().toLocaleDateString()}</title>
          ${style}
        </head>
        <body>
          ${content}
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Garden Planting Planner</h1>
          <p className="text-green-100">Plan your perfect garden based on your location</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select your USDA Hardiness Zone
              </label>
              <select
                value={zone}
                onChange={(e) => setZone(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                {Array.from({ length: 9 }, (_, i) => i + 2).map(z => (
                  <option key={z} value={z}>Zone {z}</option>
                ))}
              </select>
            </div>

            {selectedPlant && (
              <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">{selectedPlant.name} Details</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-2">
                    <Sun className="text-yellow-500" />
                    <span>{selectedPlant.sunRequirements} sun</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="text-blue-500" />
                    <span>{selectedPlant.spacing}" spacing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-purple-500" />
                    <span>{selectedPlant.harvestTime} weeks to harvest</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlant(null)}
                  className="mt-4 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear selection
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {filteredPlants.map((plant) => (
                <PlantCard
                  key={plant.name}
                  plant={plant}
                  onSelect={setSelectedPlant}
                  isSelected={selectedPlant?.name === plant.name}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select
                  value={selectedBedId}
                  onChange={(e) => setSelectedBedId(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  {gardenBeds.map(bed => (
                    <option key={bed.id} value={bed.id}>{bed.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewBedForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bed
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Layout
                </button>
              </div>
            </div>

            {showNewBedForm && (
              <div className="mb-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Add New Garden Bed</h3>
                <form onSubmit={handleAddBed} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bed Name
                    </label>
                    <input
                      type="text"
                      value={newBedName}
                      onChange={(e) => setNewBedName(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Width (feet)
                      </label>
                      <input
                        type="number"
                        value={newBedWidth}
                        onChange={(e) => setNewBedWidth(Number(e.target.value))}
                        min="1"
                        max="20"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height (feet)
                      </label>
                      <input
                        type="number"
                        value={newBedHeight}
                        onChange={(e) => setNewBedHeight(Number(e.target.value))}
                        min="1"
                        max="20"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowNewBedForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Create Bed
                    </button>
                  </div>
                </form>
              </div>
            )}

            <GardenLayout
              selectedPlant={selectedPlant}
              onPlantPlace={handlePlantPlace}
              availablePlants={filteredPlants}
              bed={selectedBed}
              onBedUpdate={(updatedBed) => {
                setGardenBeds(prev => prev.map(bed => 
                  bed.id === updatedBed.id ? updatedBed : bed
                ));
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}