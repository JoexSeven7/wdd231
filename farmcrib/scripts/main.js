/**
 * FarmCrib Main Module
 * Author: John Joshua
 */

import { initNavigation } from './navigation.js';
import { renderItems, initModalListeners, displayLastViewed } from './marketplace.js';

const DATA_URL = 'data.json';
const GRID_CONTAINER_ID = 'item-grid';

/**
 * Fetches agricultural item data from the local JSON file.
 * Asynchronous fetch wrapped in try...catch.
 */
async function fetchMarketplaceData() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch marketplace data:', error);
    return [];
  }
}

export function filterItems(items, query) {
  if (!query || query.trim() === '') return items;
  const lowerQuery = query.toLowerCase().trim();
  return items.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery) ||
    item.location.toLowerCase().includes(lowerQuery) ||
    item.farmer.toLowerCase().includes(lowerQuery)
  );
}

export function sortItems(items, sortBy) {
  const sorted = [...items];
  switch (sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''), 10);
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''), 10);
        return priceA - priceB;
      });
      break;
    case 'price-desc':
      sorted.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''), 10);
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''), 10);
        return priceB - priceA;
      });
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }
  return sorted;
}

async function initMarketplace() {
  const grid = document.getElementById(GRID_CONTAINER_ID);
  if (!grid) return;

  const loadingEl = document.getElementById('loading-indicator');
  const totalEl = document.getElementById('item-count');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');

  if (loadingEl) loadingEl.style.display = 'block';

  const allItems = await fetchMarketplaceData();

  if (loadingEl) loadingEl.style.display = 'none';

  let currentItems = allItems;
  if (totalEl) {
    totalEl.textContent = `${currentItems.length} items found`;
  }

  renderItems(currentItems, GRID_CONTAINER_ID);
  initModalListeners();
  displayLastViewed();

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const filtered = filterItems(allItems, searchInput.value);
      const sorted = sortSelect ? sortItems(filtered, sortSelect.value) : filtered;
      renderItems(sorted, GRID_CONTAINER_ID);
      if (totalEl) totalEl.textContent = `${sorted.length} items found`;
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const filtered = searchInput ? filterItems(allItems, searchInput.value) : allItems;
      const sorted = sortItems(filtered, sortSelect.value);
      renderItems(sorted, GRID_CONTAINER_ID);
      if (totalEl) totalEl.textContent = `${sorted.length} items found`;
    });
  }
}

async function initApp() {
  initNavigation();
  initMarketplace();

  const path = window.location.pathname;

  if (path.includes('weather.html')) {
    try {
      const weatherModule = await import('./weather.js');
      weatherModule.initWeatherPage?.();
    } catch (err) {
      console.warn('Weather module could not be initialized:', err);
    }
  }

  if (path.includes('equipment.html')) {
    try {
      const equipmentModule = await import('./equipment.js');
      equipmentModule.loadEquipment?.();
    } catch (err) {
      console.warn('Equipment module could not be initialized:', err);
    }
  }

  if (path.includes('farmers.html')) {
    try {
      const farmersModule = await import('./farmers.js');
      farmersModule.initFarmersSearch?.();
      farmersModule.renderFarmers(farmersModule.FARMERS);
    } catch (err) {
      console.warn('Farmers module could not be initialized:', err);
    }
  }

  if (path.includes('messages.html') || path.includes('contact.html')) {
    try {
      const messagingModule = await import('./messaging.js');
      messagingModule.initContactForm?.();
      messagingModule.renderMessages?.();
    } catch (err) {
      console.warn('Messaging module could not be initialized:', err);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
