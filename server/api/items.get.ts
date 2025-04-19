// server/api/items.get.ts
import type { Item, PaginatedResponse } from '~/types';

// Mock data
const mockItems: Item[] = [
  {
    id: 1,
    name: 'DOTA2',
    order: 1,
    displayNumber: '1',
    subCategories: 'Head / Weapon / Back / Shoulders / Arms / Bracers / Collection / Event / Treasure / Belt / Legs...',
    itemCount: 9,
    children: [
      { id: 11, name: 'Head', order: 1, displayNumber: '1.1', subCategories: '', children: [] },
      { id: 12, name: 'Weapon', order: 2, displayNumber: '1.2', subCategories: '', children: [] },
      { id: 13, name: 'Back', order: 3, displayNumber: '1.3', subCategories: '', children: [] },
      { id: 14, name: 'Shoulders', order: 4, displayNumber: '1.4', subCategories: '', children: [] },
      { id: 15, name: 'Arms', order: 5, displayNumber: '1.5', subCategories: '', children: [] },
      { id: 16, name: 'Bracers', order: 6, displayNumber: '1.6', subCategories: '', children: [] },
      { id: 17, name: 'Collection', order: 7, displayNumber: '1.7', subCategories: '', children: [] },
      { id: 18, name: 'Event', order: 8, displayNumber: '1.8', subCategories: '', children: [] },
      { id: 19, name: 'Treasure', order: 9, displayNumber: '1.9', subCategories: '', children: [] }
    ]
  },
  {
    id: 3,
    name: 'Valorant',
    order: 2,
    displayNumber: '2',
    subCategories: 'Skins / Weapons / Agents',
    itemCount: 3,
    children: [
      { id: 31, name: 'Skins', order: 1, displayNumber: '2.1', subCategories: '', children: [] },
      { id: 32, name: 'Weapons', order: 2, displayNumber: '2.2', subCategories: '', children: [] },
      { id: 33, name: 'Agents', order: 3, displayNumber: '2.3', subCategories: '', children: [] }
    ]
  },
  {
    id: 4,
    name: 'RUST',
    order: 3,
    displayNumber: '3',
    subCategories: 'Weapons / Clothing / Tools / Building',
    itemCount: 4,
    children: [
      { id: 41, name: 'Weapons', order: 1, displayNumber: '3.1', subCategories: '', children: [] },
      { id: 42, name: 'Clothing', order: 2, displayNumber: '3.2', subCategories: '', children: [] },
      { id: 43, name: 'Tools', order: 3, displayNumber: '3.3', subCategories: '', children: [] },
      { id: 44, name: 'Building', order: 4, displayNumber: '3.4', subCategories: '', children: [] }
    ]
  },
  {
    id: 2,
    name: 'CS2',
    order: 4,
    displayNumber: '4',
    subCategories: 'Gloves / Heavy / Knives / Pistols / Rifles / SMGs',
    itemCount: 6,
    children: [
      { id: 21, name: 'Gloves', order: 1, displayNumber: '4.1', subCategories: '', children: [] },
      { id: 22, name: 'Heavy', order: 2, displayNumber: '4.2', subCategories: '', children: [] },
      { id: 23, name: 'Knives', order: 3, displayNumber: '4.3', subCategories: '', children: [] },
      { id: 24, name: 'Pistols', order: 4, displayNumber: '4.4', subCategories: '', children: [] },
      { id: 25, name: 'Rifles', order: 5, displayNumber: '4.5', subCategories: '', children: [] },
      { id: 26, name: 'SMGs', order: 6, displayNumber: '4.6', subCategories: '', children: [] }
    ]
  }
];

// Total number of items (including children) for pagination
const getTotalItems = (items: Item[]): number => {
  let count = items.length;
  for (const item of items) {
    if (item.children && item.children.length > 0) {
      count += getTotalItems(item.children);
    }
  }
  return count;
};

export default defineEventHandler(async (event): Promise<PaginatedResponse<Item>> => {
  // Get query parameters
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  
  // Calculate pagination
  const totalItems = getTotalItems(mockItems);
  const totalPages = Math.ceil(totalItems / limit);
  
  // Return paginated response
  return {
    data: mockItems,
    meta: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit
    }
  };
});