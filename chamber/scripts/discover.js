// ===== CHAMBER — discover.js =====

import { interests } from "../data/discover/interests.mjs";

// ---------- MENU TOGGLE ----------
const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
        primaryNav.classList.toggle('open');
        const isOpen = primaryNav.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

// ---------- FOOTER DATES ----------
const yearSpan = document.getElementById('copyright-year');
const modDateSpan = document.getElementById('mod-date');

if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

if (modDateSpan) {
    const lastModified = new Date(document.lastModified);
    modDateSpan.textContent = lastModified.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ---------- VISIT MESSAGE ----------
function showVisitMessage() {
    const container = document.getElementById('visit-message');
    if (!container) return;

    const lastVisit = localStorage.getItem('lastVisitDate');
    const now = Date.now();
    const oneDay = 86400000;

    let message;
    if (lastVisit === null) {
        message = 'Welcome! Let us know if you have any questions.';
    } else {
        const diffDays = Math.floor((now - parseInt(lastVisit, 10)) / oneDay);
        if (diffDays < 1) {
            message = 'Back so soon! Awesome!';
        } else if (diffDays === 1) {
            message = 'You last visited 1 day ago.';
        } else {
            message = 'You last visited ' + diffDays + ' days ago.';
        }
    }

    container.textContent = message;
    localStorage.setItem('lastVisitDate', String(now));
}

// ---------- RENDER CARDS ----------
function renderDiscover() {
    const container = document.getElementById('discover-container');
    if (!container) return;

    container.innerHTML = interests.map((item, index) => `
        <article class="discover-card grid-item-${index + 1}">
            <figure>
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </figure>
            <div class="discover-card-body">
                <h2>${item.title}</h2>
                <address>${item.address}</address>
                <p>${item.description}</p>
                <a href="#" class="btn-primary">Learn More</a>
            </div>
        </article>
    `).join('');
}

// ---------- INIT ----------
showVisitMessage();
renderDiscover();
