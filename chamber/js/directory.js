/* ===== CHAMBER — directory.js ===== */

/* ── MENU TOGGLE ─────────────────────────────────────────────────────────── */
const menuToggle  = document.getElementById('menu-toggle');
const primaryNav  = document.getElementById('primary-nav');

menuToggle.addEventListener('click', () => {
    primaryNav.classList.toggle('open');
    const isOpen = primaryNav.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
});

/* ── FOOTER DATES ────────────────────────────────────────────────────────── */
const yearSpan   = document.getElementById('copyright-year');
const modDateSpan = document.getElementById('mod-date');

if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

if (modDateSpan) {
    const lastModified = new Date(document.lastModified);
    modDateSpan.textContent = lastModified.toLocaleDateString('en-US', {
        year:   'numeric',
        month:  'long',
        day:    'numeric'
    });
}

/* ── VIEW TOGGLE ─────────────────────────────────────────────────────────── */
const gridBtn  = document.getElementById('grid-view');
const listBtn  = document.getElementById('list-view');
const gridEl   = document.getElementById('member-grid');

function setView(mode) {
    gridEl.classList.remove('grid-view', 'list-view');
    gridEl.classList.add(mode + '-view');
    gridBtn.classList.toggle('active', mode === 'grid');
    listBtn.classList.toggle('active', mode === 'list');
}

gridBtn.addEventListener('click', () => setView('grid'));
listBtn.addEventListener('click', () => setView('list'));

/* ── MEMBER DATA ────────────────────────────────────────────────────────── */
let allMembers = [];

const levelLabel = { 1: 'Member', 2: 'Silver', 3: 'Gold' };
const levelClass = { 1: 'badge-member', 2: 'badge-silver', 3: 'badge-gold' };

function getBadge(level) {
    return `<span class="member-badge ${levelClass[level] || 'badge-member'}">
                ${levelLabel[level] || 'Member'}
            </span>`;
}

function cardHTML(member) {
    const src    = `images/${member.image}`;
    const initial = member.company.charAt(0).toUpperCase();
    return `
    <article class="member-card">
        <div class="member-card-image" role="img" aria-label="${member.company} logo">
            <img src="${src}"
                 alt="${member.company} logo"
                 loading="lazy"
                 onerror="this.style.display='none';this.parentElement.removeAttribute('role');this.parentElement.setAttribute('aria-label','${member.company} logo');this.parentElement.textContent='${initial}';">
        </div>
        <div class="member-card-body">
            <div class="member-card-header">
                <h3>${member.company}</h3>
                ${getBadge(member.level)}
            </div>
            <p>${member.address}</p>
            <p><a href="tel:${member.phone.replace(/\D/g, '')}">${member.phone}</a></p>
            <p><a href="${member.url}" target="_blank" rel="noopener noreferrer">${member.url.replace(/^https?:\/\//, '')}</a></p>
            <p class="member-card-info">${member.info}</p>
        </div>
    </article>`;
}

function render(list) {
    if (list.length === 0) {
        gridEl.innerHTML = '<p class="loading">No members found matching your search.</p>';
        return;
    }
    gridEl.innerHTML = list.map(cardHTML).join('');
}

/* ── FETCH ───────────────────────────────────────────────────────────────── */
async function loadMembers() {
    try {
        const res = await fetch('data/members.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        allMembers = await res.json();
        render(allMembers);
    } catch (err) {
        console.error('Error loading members:', err);
        gridEl.innerHTML = '<p class="loading">Unable to load member data.</p>';
    }
}

/* ── SEARCH ──────────────────────────────────────────────────────────────── */
const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const q = searchInput.value.toLowerCase().trim();
        if (!q) { render(allMembers); return; }
        render(allMembers.filter(m =>
            m.company.toLowerCase().includes(q) ||
            m.address.toLowerCase().includes(q) ||
            m.phone.includes(q) ||
            m.url.toLowerCase().includes(q)
        ));
    });
}

/* ── INIT ────────────────────────────────────────────────────────────────── */
loadMembers();
