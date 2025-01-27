export interface Plant {
  name: string;
  scientificName: string;
  startIndoors?: string;
  transplantOutdoors?: string;
  directSow?: string;
  harvestTime: number; // weeks from planting
  spacing: number; // inches
  sunRequirements: 'full' | 'partial' | 'shade';
  description: string;
  icon: string; // Lucide icon name
  zones: number[]; // USDA hardiness zones
}

export interface GardenPlan {
  plants: {
    plantId: string;
    quantity: number;
    plannedDate: string;
  }[];
  location: {
    zone: number;
    city: string;
  };
}

export interface PlacedPlant {
  plant: Plant;
  x: number;
  y: number;
}

export interface GardenBed {
  id: string;
  name: string;
  width: number; // feet
  height: number; // feet
  plants: PlacedPlant[];
}