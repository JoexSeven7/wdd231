/**
 * Farmers (Verified Profiles) Module
 * Renders farmer profile cards with ratings, location, and specialties
 * Author: FarmCrib Development Team
 */

import { renderStars } from './marketplace.js';

const FARMERS = [
  { id: 'f1', name: 'Ahmad Ibrahim', location: 'Kaduna', specialty: 'Tomatoes, Rice', rating: 4.8, reviews: 124, verified: true, joined: '2024-01-15', products: 12 },
  { id: 'f2', name: 'Chidi Okafor', location: 'Ebonyi', specialty: 'Organic Rice', rating: 4.9, reviews: 89, verified: true, joined: '2024-02-20', products: 8 },
  { id: 'f3', name: 'Dorothy Dalyop', location: 'Plateau', specialty: 'Sweet Potatoes', rating: 4.7, reviews: 56, verified: true, joined: '2024-03-10', products: 6 },
  { id: 'f4', name: 'Sunday Adeyemi', location: 'Oyo', specialty: 'Yellow Pepper', rating: 4.6, reviews: 42, verified: true, joined: '2024-04-05', products: 5 },
  { id: 'f5', name: 'Funke Adekunle', location: 'Ondo', specialty: 'Cassava', rating: 4.5, reviews: 67, verified: true, joined: '2024-04-18', products: 9 },
  { id: 'f6', name: 'Musa Bello', location: 'Kano', specialty: 'Sorghum', rating: 4.4, reviews: 38, verified: true, joined: '2024-05-02', products: 4 },
  { id: 'f7', name: 'Samuel Ogunleye', location: 'Ogun', specialty: 'Cocoa Beans', rating: 4.9, reviews: 112, verified: true, joined: '2024-01-28', products: 7 },
  { id: 'f8', name: 'Ebere Nwachukwu', location: 'Rivers', specialty: 'Palm Oil', rating: 4.7, reviews: 95, verified: true, joined: '2024-02-14', products: 6 },
  { id: 'f9', name: 'Habu Yusuf', location: 'Nasarawa', specialty: 'Groundnuts', rating: 4.6, reviews: 73, verified: true, joined: '2024-03-22', products: 5 },
  { id: 'f10', name: 'Amina Sani', location: 'Kano', specialty: 'Okra', rating: 4.5, reviews: 51, verified: true, joined: '2024-04-30', products: 4 },
  { id: 'f11', name: 'Fatima Mohammed', location: 'Kwara', specialty: 'Shea Butter', rating: 4.8, reviews: 87, verified: true, joined: '2024-05-15', products: 3 },
  { id: 'f12', name: 'Emeka Adeyemi', location: 'Lagos', specialty: 'Catfish', rating: 4.7, reviews: 63, verified: true, joined: '2024-01-10', products: 8 },
  { id: 'f13', name: 'Aliyu Suleiman', location: 'Katsina', specialty: 'Millet', rating: 4.3, reviews: 29, verified: true, joined: '2024-06-01', products: 2 },
  { id: 'f14', name: 'Olumide Ojo', location: 'Osun', specialty: 'Kolanut', rating: 4.6, reviews: 34, verified: true, joined: '2024-06-20', products: 3 },
  { id: 'f15', name: 'Chinwe Eze', location: 'Enugu', specialty: 'Pineapple', rating: 4.8, reviews: 102, verified: true, joined: '2024-02-08', products: 9 }
];

/**
 * Render a single farmer card via template literal
 */
export function createFarmerCard(farmer) {
  const stars = renderStars(farmer.rating);
  const initials = farmer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return `
    <article class="farmer-card" data-farmer-id="${farmer.id}" tabindex="0" role="button" aria-label="View profile of ${farmer.name}">
      <div class="farmer-avatar" aria-hidden="true">${initials}</div>
      <div class="farmer-body">
        <h3 class="farmer-name">${farmer.name}</h3>
        <p class="farmer-location">📍 ${farmer.location}</p>
        <p class="farmer-specialty"><strong>Specialty:</strong> ${farmer.specialty}</p>
        <p class="farmer-rating">
          <span class="stars" aria-label="${farmer.rating} out of 5">${stars}</span>
          <span>(${farmer.reviews})</span>
        </p>
        <div class="farmer-meta">
          <span>🛒 ${farmer.products} products</span>
          <span>🗓️ Joined ${new Date(farmer.joined).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
        </div>
        ${farmer.verified ? '<span class="verified-badge" aria-label="Verified Farmer">✅ Verified</span>' : ''}
      </div>
    </article>
  `;
}

export function renderFarmers(farmers) {
  const container = document.getElementById('farmers-grid');

  if (!container) return;

  if (!farmers || farmers.length === 0) {
    container.innerHTML = `<p class="empty-message" role="status">No farmers found.</p>`;
    return;
  }

  container.innerHTML = farmers.map(f => createFarmerCard(f)).join('');

  container.querySelectorAll('.farmer-card').forEach(card => {
    const id = card.dataset.farmerId;

    card.addEventListener('click', () => openFarmerModal(id));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openFarmerModal(id);
      }
    });
  });
}

export function initFarmersSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const filtered = filterFarmers(searchInput.value);
      renderFarmers(filtered);
    });
  }
}

export function openFarmerModal(id) {
  const farmer = FARMERS.find(f => f.id === id);
  if (!farmer) return;

  const stars = renderStars(farmer.rating);

  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modal = document.getElementById('item-modal');

  if (!modal || !modalTitle || !modalBody) return;

  modalTitle.textContent = farmer.name;
  modalBody.innerHTML = `
    <div class="farmer-modal-header">
      <div class="farmer-avatar" style="width:80px;height:80px;font-size:1.75rem;" aria-hidden="true">${farmer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div>
      <div>
        <p><strong>📍</strong> ${farmer.location}</p>
        <p><strong>🛒 Specialty:</strong> ${farmer.specialty}</p>
        <p><strong>⭐</strong> ${stars} (${farmer.reviews} reviews)</p>
      </div>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Status</span>
      <span style="color: var(--color-success); font-weight: 700;">✅ Verified Farmer</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Products Listed</span>
      <span>${farmer.products}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Member Since</span>
      <span>${new Date(farmer.joined).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
    </div>
    <p style="margin-top:12px;">This farmer has been verified by FarmCrib and has a proven track record of timely deliveries and quality produce.</p>
  `;

  modal.classList.add('open');
}

export function filterFarmers(query) {
  const q = (query || '').toLowerCase().trim();

  if (!q) return FARMERS;

  return FARMERS.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.location.toLowerCase().includes(q) ||
    f.specialty.toLowerCase().includes(q)
  );
}
