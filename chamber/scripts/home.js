/* ===== CHAMBER — home.js ===== */

/* ── MENU TOGGLE ─────────────────────────────────────────────────────────── */
const menuToggle  = document.getElementById('menu-toggle');
const primaryNav  = document.getElementById('primary-nav');

if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
        primaryNav.classList.toggle('open');
        const isOpen = primaryNav.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

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

/* ── EVENT DATA (from JSON) ─────────────────────────────────────────────── */
let allEvents = [];

async function loadEvents() {
    try {
        const res = await fetch('data/event.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        allEvents = await res.json();
        renderEvents();
    } catch (err) {
        console.error('Error loading events:', err);
        allEvents = [
            {
                title: "Monthly Networking Mixer",
                date: "June 15, 2026",
                time: "6:00 PM - 9:00 PM",
                description: "Join fellow business leaders for networking and collaboration."
            },
            {
                title: "Small Business Workshop",
                date: "June 22, 2026",
                time: "9:00 AM - 12:00 PM",
                description: "Learn strategies for growing your small business."
            },
            {
                title: "Annual Business Summit",
                date: "July 10, 2026",
                time: "8:00 AM - 5:00 PM",
                description: "Keynote speakers and breakout sessions."
            }
        ];
        renderEvents();
    }
}

function renderEvents() {
    const container = document.getElementById('events-container');
    if (!container) return;

    container.innerHTML = allEvents.slice(0, 3).map(event => `
        <div class="card event-card">
            <h3>${event.title}</h3>
            <p class="card-date">${event.date} | ${event.time}</p>
            <p>${event.description}</p>
        </div>
    `).join('');
}

/* ── WEATHER (OpenWeatherMap API) ─────────────────────────────────────────── */
const WEATHER_API_KEY = '71befd09c33573f1deb638161a8db2ee';
const WEATHER_CITY = 'Lagos,NG';
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_CITY}&appid=${WEATHER_API_KEY}&units=metric`;

async function loadWeather() {
    const container = document.getElementById('weather-container');
    if (!container) return;

    try {
        const response = await fetch(WEATHER_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        const current = data.list[0];
        const currentTemp = Math.round(current.main.temp);
        const currentDesc = current.weather[0].description;

        const forecastDays = [];
        const seenDates = new Set();
        const today = new Date().getDate();

        for (let i = 0; i < data.list.length && forecastDays.length < 3; i++) {
            const item = data.list[i];
            const date = new Date(item.dt * 1000);
            const dateNum = date.getDate();

            if (dateNum !== today && !seenDates.has(dateNum)) {
                seenDates.add(dateNum);
                forecastDays.push({
                    date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    temp: Math.round(item.main.temp)
                });
            }
        }

        container.innerHTML = `
            <div class="weather-card">
                <div class="weather-icon">${getWeatherIcon(current.weather[0].icon)}</div>
                <div class="weather-temp">${currentTemp}°C</div>
                <div class="weather-desc">${currentDesc}</div>
                <div class="weather-forecast">
                    <h4>3-Day Forecast</h4>
                    ${forecastDays.map(day => `
                        <div class="forecast-day">
                            <span class="forecast-date">${day.date}</span>:
                            <span class="forecast-temp">${day.temp}°C</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (err) {
        const weatherData = {
            temp: 28,
            description: "Partly Cloudy",
            icon: "☀️",
            forecast: [
                { date: 'Mon', temp: 29 },
                { date: 'Tue', temp: 30 },
                { date: 'Wed', temp: 28 }
            ]
        };

        container.innerHTML = `
            <div class="weather-card">
                <div class="weather-icon">${weatherData.icon}</div>
                <div class="weather-temp">${weatherData.temp}°C</div>
                <div class="weather-desc">${weatherData.description}</div>
                <div class="weather-forecast">
                    <h4>3-Day Forecast</h4>
                    ${weatherData.forecast.map(day => `
                        <div class="forecast-day">
                            <span class="forecast-date">${day.date}</span>:
                            <span class="forecast-temp">${day.temp}°C</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

function getWeatherIcon(iconCode) {
    const icons = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '🌨️', '13n': '🌨️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return icons[iconCode] || '☀️';
}

/* ── MEMBER SPOTLIGHT ─────────────────────────────────────────────────────── */
async function loadSpotlightMembers() {
    const container = document.getElementById('spotlight-container');
    if (!container) return;

    try {
        const res = await fetch('data/members.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const members = await res.json();

        const eligibleMembers = members.filter(m => m.level >= 2);
        const shuffled = eligibleMembers.sort(() => 0.5 - Math.random());
        const spotlightMembers = shuffled.slice(0, 3);

        container.innerHTML = spotlightMembers.map(member => `
            <div class="card spotlight-card">
                <div class="spotlight-logo">
                    <img src="images/${member.image}" alt="${member.company} logo" loading="lazy" width="60" height="60">
                </div>
                <h3>${member.company}</h3>
                <p class="member-level ${member.level === 3 ? 'badge-gold' : 'badge-silver'}">
                    ${member.level === 3 ? 'Gold Member' : 'Silver Member'}
                </p>
                <p>${member.address}</p>
                <p><a href="tel:${member.phone.replace(/\D/g, '')}">${member.phone}</a></p>
                <p><a href="${member.url}" target="_blank" rel="noopener noreferrer">${member.url.replace(/^https?:\/\//, '')}</a></p>
            </div>
        `).join('');

        if (spotlightMembers.length === 0) {
            container.innerHTML = '<p class="loading">No spotlight members available.</p>';
        }
    } catch (err) {
        container.innerHTML = '<p class="loading">Unable to load spotlight data.</p>';
    }
}

/* ── INIT ────────────────────────────────────────────────────────────────── */
loadEvents();
loadWeather();
loadSpotlightMembers(); 