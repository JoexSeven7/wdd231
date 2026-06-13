/**
 * Marketplace Module
 * Fetches agricultural data, renders cards, handles modals, and manages localStorage
 * Author: FarmCrib Development Team
 */

/**
 * Renders a star rating string based on numeric rating value
 * @param {number} rating - rating out of 5
 * @returns {string} HTML string of star icons
 */
export function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  let stars = '★'.repeat(fullStars);
  if (halfStar) stars += '½';
  stars += '☆'.repeat(emptyStars);
  
  return stars;
}

/**
 * Creates the HTML for a single item card using template literals
 * @param {object} item - agricultural item data
 * @returns {string} HTML string for the card
 */
export function createItemCard(item) {
  const stars = renderStars(item.rating);
  const imgWidth = 400;
  const imgHeight = 250;
  const imgSrc = item.image || 'images/placeholder.jpg';
  
  return `
    <article class="item-card" data-item-id="${item.id}" tabindex="0" role="button" aria-label="View details for ${item.name}">
      <img 
        src="${imgSrc}" 
        alt="${item.name} - ${item.category}" 
        class="item-card-img" 
        width="${imgWidth}" 
        height="${imgHeight}" 
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
          <span class="stars" aria-label="${item.rating} out of 5 stars">${stars}</span>
          <span>(${item.reviews})</span>
        </div>
      </div>
    </article>
  `;
}

/**
 * Renders all item cards to the grid container
 * @param {Array} items - array of agricultural items
 * @param {string} containerId - ID of the grid container element
 */
export function renderItems(items, containerId) {
  const grid = document.getElementById(containerId);
  
  if (!grid) {
    console.error(`Container #${containerId} not found`);
    return;
  }

  if (items.length === 0) {
    grid.innerHTML = `<p class="empty-message" role="status">No items found. Try adjusting your search.</p>`;
    return;
  }

  const cardsHTML = items.map(item => createItemCard(item)).join('');
  grid.innerHTML = cardsHTML;

  // Attach click and keyboard event listeners to each card
  const cards = grid.querySelectorAll('.item-card');
  cards.forEach(card => {
    const itemId = parseInt(card.dataset.itemId, 10);
    
    card.addEventListener('click', () => openModal(itemId, items));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(itemId, items);
      }
    });
  });
}

/**
 * Opens the modal dialog with detailed information about a specific item
 * @param {number} itemId - the ID of the item to display
 * @param {Array} allItems - full array of items to look up
 */
export function openModal(itemId, allItems) {
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;

  // Save last viewed item to localStorage
  localStorage.setItem('farmcrib_last_viewed', JSON.stringify({
    itemId: item.id,
    itemName: item.name,
    timestamp: new Date().toISOString()
  }));

  const modal = document.getElementById('item-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close');

  if (!modal || !modalTitle || !modalBody) return;

  const stars = renderStars(item.rating);
  const imgSrc = item.image || 'images/placeholder.jpg';

  modalTitle.textContent = item.name;
  modalBody.innerHTML = `
    <img 
      src="${imgSrc}" 
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
      <span class="modal-detail-label">Price</span>
      <span>${item.price} ${item.unit}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Location</span>
      <span>${item.location}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Farmer</span>
      <span>${item.farmer}</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Rating</span>
      <span>${stars} (${item.rating}/5 - ${item.reviews} reviews)</span>
    </div>
    <div class="modal-detail-row">
      <span class="modal-detail-label">Availability</span>
      <span style="color: var(--color-success); font-weight: 700;">${item.available ? '✓ In Stock' : '✗ Currently Unavailable'}</span>
    </div>
    <p style="margin-top: var(--spacing-md); line-height: 1.7;">${item.description}</p>
  `;

  modal.classList.add('open');
  
  // Focus the close button for accessibility
  if (modalCloseBtn) {
    setTimeout(() => modalCloseBtn.focus(), 100);
  }

  // Trap focus inside modal
  document.addEventListener('keydown', trapFocus);
}

/**
 * Closes the modal dialog
 */
export function closeModal() {
  const modal = document.getElementById('item-modal');
  if (modal) {
    modal.classList.remove('open');
  }
  document.removeEventListener('keydown', trapFocus);
}

/**
 * Focus trap for modal dialog (accessibility)
 * @param {KeyboardEvent} event
 */
function trapFocus(event) {
  if (event.key !== 'Tab') return;

  const modal = document.getElementById('item-modal');
  if (!modal) return;

  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    if (document.activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    }
  } else {
    if (document.activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }
}

/**
 * Attaches modal event listeners (close button, overlay click, Escape key)
 */
export function initModalListeners() {
  const modalCloseBtn = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('item-modal');

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}

/**
 * Loads and displays the last viewed item from localStorage
 */
export function displayLastViewed() {
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

/**
 * Clears stored preferences
 */
export function clearStoredData() {
  localStorage.removeItem('farmcrib_last_viewed');
  displayLastViewed();
}
