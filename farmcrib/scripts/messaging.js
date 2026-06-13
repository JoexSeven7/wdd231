/**
 * Messaging / Contact Module
 * Exposes a message form that stores messages in localStorage
 * Author: FarmCrib Development Team
 */

const MSG_KEY = 'farmcrib_messages';

export function loadSavedMessages() {
  try {
    const raw = localStorage.getItem(MSG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMessage(message) {
  const messages = loadSavedMessages();
  messages.unshift(message);
  localStorage.setItem(MSG_KEY, JSON.stringify(messages));
}

export function renderMessages() {
  const container = document.getElementById('messages-list');
  if (!container) return;

  const messages = loadSavedMessages();

  if (messages.length === 0) {
    container.innerHTML = `<p class="empty-message">No messages yet. Send a message to get started.</p>`;
    return;
  }

  container.innerHTML = messages.map(msg => `
    <li class="message-item">
      <div class="message-header">
        <strong>${escapeHtml(msg.name)}</strong>
        <span>${escapeHtml(msg.subject)}</span>
        <time>${new Date(msg.timestamp).toLocaleString()}</time>
      </div>
      <p class="message-body">${escapeHtml(msg.body)}</p>
      <p class="message-meta">📧 ${escapeHtml(msg.email)}</p>
    </li>
  `).join('');
}

export function initContactForm() {
  const form = document.getElementById('contact-form');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.querySelector('#contact-name').value.trim();
    const email = form.querySelector('#contact-email').value.trim();
    const subject = form.querySelector('#contact-subject').value.trim() || '(No Subject)';
    const message = form.querySelector('#contact-message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    saveMessage({
      id: crypto.randomUUID(),
      name,
      email,
      subject,
      body: message,
      timestamp: new Date().toISOString()
    });

    renderMessages();
    form.reset();
  });
}

export function initDemandForm() {
  const form = document.getElementById('demand-form');

  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const produce = form.querySelector('#demand-produce').value.trim();
    const budget = form.querySelector('#demand-budget').value.trim();
    const location = form.querySelector('#demand-location').value.trim();

    if (!produce || !budget || !location) {
      alert('Please fill in all required fields.');
      return;
    }

    const demand = {
      id: crypto.randomUUID(),
      produce,
      budget,
      location,
      timestamp: new Date().toISOString()
    };

    const demands = loadDemands();
    demands.unshift(demand);
    localStorage.setItem('farmcrib_demands', JSON.stringify(demands));

    renderDemands();
    form.reset();
  });
}

function loadDemands() {
  try {
    const raw = localStorage.getItem('farmcrib_demands');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function renderDemands() {
  const container = document.getElementById('demands-list');
  if (!container) return;

  const demands = loadDemands();

  if (demands.length === 0) {
    container.innerHTML = `<p class="empty-message">No active demands yet.</p>`;
    return;
  }

  container.innerHTML = demands.map(d => `
    <li class="demand-item">
      <span>🛒 <strong>${escapeHtml(d.produce)}</strong></span>
      <span>💰 ${escapeHtml(d.budget)}</span>
      <span>📍 ${escapeHtml(d.location)}</span>
      <time>${new Date(d.timestamp).toLocaleString()}</time>
    </li>
  `).join('');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
