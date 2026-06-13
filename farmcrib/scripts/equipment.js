/**
 * Equipment Rental Module
 * Loads equipment data from equipment.json and renders with rent modal
 * Author: FarmCrib Development Team
 */

import { initModalListeners, renderStars, openModal, closeModal } from './marketplace.js';

const DATA_URL = 'equipment.json';
const GRID_ID = 'equipment-grid';

let allEquipmentData = [];
let currentItems = [];

export async function loadEquipment() {
  const grid = document.getElementById(GRID_ID);
  if (!grid) return;

  let data = [];

  try {
    const res = await fetch(DATA_URL);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    data = await res.json();
    allEquipmentData = data;
    currentItems = [...data];
  } catch (err) {
    console.error('Failed to load equipment data:', err);
    grid.innerHTML = `
      <div class="error-message" role="alert" style="grid-column:1/-1;">
        <p><strong>Unable to load equipment listings.</strong></p>
        <p><small>${err.message}</small></p>
      </div>
    `;
    return;
  }

  initSearchFilter();
  renderItems(currentItems, GRID_ID);
  initModalListeners();
  displayLastViewedEquipment();
}

function filterEquipment(query) {
  if (!query || query.trim() === '') return allEquipmentData;
  const lowerQuery = query.toLowerCase().trim();
  return allEquipmentData.filter(item =>
    item.name.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery) ||
    item.location.toLowerCase().includes(lowerQuery) ||
    item.owner.toLowerCase().includes(lowerQuery)
  );
}

function sortEquipment(items, sortBy) {
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

function initSearchFilter() {
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const totalEl = document.getElementById('item-count');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const filtered = filterEquipment(searchInput.value);
      const sorted = sortSelect ? sortEquipment(filtered, sortSelect.value) : filtered;
      renderItems(sorted, GRID_ID);
      if (totalEl) totalEl.textContent = `${sorted.length} items found`;
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const filtered = searchInput ? filterEquipment(searchInput.value) : allEquipmentData;
      const sorted = sortEquipment(filtered, sortSelect.value);
      renderItems(sorted, GRID_ID);
      if (totalEl) totalEl.textContent = `${sorted.length} items found`;
    });
  }
}

export function renderItems(items, containerId) {
  const grid = document.getElementById(containerId);

  if (!grid) return;

  if (!items || items.length === 0) {
    grid.innerHTML = `<p class="empty-message" role="status">No equipment found.</p>`;
    return;
  }

  const cards = items.map(item => {
    const stars = renderStars(item.rating);
    return `
      <article class="item-card" data-item-id="${item.id}" tabindex="0" role="button" aria-label="View details for ${item.name}">
        <img
          src="${item.image}"
          alt="${item.name}"
          class="item-card-img"
          width="400"
          height="250"
          loading="lazy"
          onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 250%22%3E%3Crect fill=%22%23E0E0E0%22 width=%22400%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23999%22 font-family=%22sans-serif%22 font-size=%2216%22%3ENo Image%3C/text%3E%3C/svg%3E'"
        >
        <div class="item-card-body">
          <span class="item-card-category">${item.category}</span>
          <h3 class="item-card-title">${item.name}</h3>
          <p class="item-card-price">${item.price} <small>${item.unit}</small></p>
          <p class="item-card-location">
            <span aria-hidden="true">📍</span> ${item.location}
          </p>
          <div class="item-card-rating">
            <span class="stars" aria-label="${item.rating} out of 5">${stars}</span>
            <span>(${item.reviews})</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  grid.innerHTML = cards;

  grid.querySelectorAll('.item-card').forEach(card => {
    const id = card.dataset.itemId;
    card.addEventListener('click', () => openEquipmentModal(id, items));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openEquipmentModal(id, items);
      }
    });
  });
}

export function openEquipmentModal(itemId, allItems) {
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;

  localStorage.setItem('farmcrib_last_viewed', JSON.stringify({
    itemId: item.id,
    itemName: item.name,
    timestamp: new Date().toISOString()
  }));

  const modal = document.getElementById('item-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  if (!modal || !modalTitle || !modalBody) return;

  const stars = renderStars(item.rating);

  modalTitle.textContent = item.name;
  modalBody.innerHTML = `
    <img
      src="${item.image}"
      alt="${item.name}"
      width="600"
      height="300"
      loading="lazy"
      onerror="this.style.display='none'"
    >
    <div class="modal-detail-row">
      <span class="modal-detail-label">Category</span>
      <span>${item.category}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Rental Price</span>
      <span>${item.price} ${item.unit}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Location</span>
      <span>${item.location}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Owner</span>
      <span>${item.owner}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Rating</span>
      <span>${stars} (${item.rating}/5 - ${item.reviews} reviews)</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Availability</span>
      <span style="color: var(--color-success); font-weight: 700;">${item.available ? '✓ Available' : '✗ Currently Unavailable'}</span>
    </div>
    <p style="margin-top:12px;">Click an owner link or send a rental request through your FarmCrib account.</p>
  `;

  modal.classList.add('open');
}

function displayLastViewedEquipment() {
  try {
    const lastViewed = localStorage.getItem('farmcrib_last_viewed');
    if (lastViewed) {
      const data = JSON.parse(lastViewed);
      const infoEl = document.getElementById('last-viewed-info');
      if (infoEl) {
        const date = new Date(data.timestamp).toLocaleString();
        infoEl.textContent = `Last viewed: ${data.itemName} on ${date}`;
      }
    }
  } catch (error) {
    console.warn('Could not load last viewed item:', error);
  }
}
