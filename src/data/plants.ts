import { Plant } from '../types';

export const plants: Plant[] = [
  {
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    startIndoors: 'February-March',
    transplantOutdoors: 'April-May',
    harvestTime: 12,
    spacing: 24,
    sunRequirements: 'full',
    description: 'Popular garden vegetable, great for beginners. Needs support as it grows.',
    icon: 'Flower2',
    zones: [3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    name: 'Lettuce',
    scientificName: 'Lactuca sativa',
    directSow: 'March-September',
    harvestTime: 6,
    spacing: 6,
    sunRequirements: 'partial',
    description: 'Quick-growing leafy green, can be harvested continuously.',
    icon: 'Leaf',
    zones: [2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    name: 'Carrot',
    scientificName: 'Daucus carota',
    directSow: 'April-July',
    harvestTime: 10,
    spacing: 3,
    sunRequirements: 'full',
    description: 'Root vegetable that prefers loose, well-draining soil.',
    icon: 'Carrot',
    zones: [3, 4, 5, 6, 7, 8, 9]
  }
];