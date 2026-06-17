/**
 * Weather Insights Module
 * Fetches real weather data using OpenWeatherMap API for Nigerian agricultural regions
 * Author: FarmCrib Development Team
 */

const WEATHER_API_KEY = '71befd09c33573f1deb638161a8db2ee';

const WEATHER_CODE_MAP = {
  '01d': { label: 'Clear sky', icon: '☀️', advice: 'Ideal for harvesting and field preparation.' },
  '01n': { label: 'Clear night', icon: '🌙', advice: 'Good conditions for irrigation.' },
  '02d': { label: 'Few clouds', icon: '⛅', advice: 'Good conditions for most farming activities.' },
  '02n': { label: 'Few clouds', icon: '☁️', advice: 'Good conditions for most farming activities.' },
  '03d': { label: 'Scattered clouds', icon: '☁️', advice: 'Monitor humidity; good for field work.' },
  '03n': { label: 'Scattered clouds', icon: '☁️', advice: 'Monitor humidity; good for field work.' },
  '04d': { label: 'Broken clouds', icon: '☁️', advice: 'Suitable for spraying and light field work.' },
  '04n': { label: 'Broken clouds', icon: '☁️', advice: 'Suitable for spraying and light field work.' },
  '09d': { label: 'Shower rain', icon: '🌧️', advice: 'Light rain; delay harvesting if possible.' },
  '09n': { label: 'Shower rain', icon: '🌧️', advice: 'Light rain; delay harvesting if possible.' },
  '10d': { label: 'Rain', icon: '🌦️', advice: 'Consider switching to covered tasks.' },
  '10n': { label: 'Rain', icon: '🌧️', advice: 'Consider switching to covered tasks.' },
  '11d': { label: 'Thunderstorm', icon: '⛈️', advice: 'Seek shelter; suspend all outdoor farm activities.' },
  '11n': { label: 'Thunderstorm', icon: '⛈️', advice: 'Seek shelter; suspend all outdoor farm activities.' },
  '13d': { label: 'Snow', icon: '❄️', advice: 'Rare in Nigeria; monitor for unusual weather.' },
  '13n': { label: 'Snow', icon: '❄️', advice: 'Rare in Nigeria; monitor for unusual weather.' },
  '50d': { label: 'Mist', icon: '🌫️', advice: 'Avoid spraying operations; poor visibility.' },
  '50n': { label: 'Mist', icon: '🌫️', advice: 'Avoid spraying operations; poor visibility.' }
};

export function getWeatherMeta(iconCode) {
  return WEATHER_CODE_MAP[iconCode] || { label: 'Unknown', icon: '❓', advice: 'Check local forecasts.' };
}

export async function fetchWeather(query) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${WEATHER_API_KEY}&units=metric`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Weather fetch failed with status ${res.status}`);
  }

  const json = await res.json();
  return json;
}

export function createWeatherCard(regionName, weather) {
  const meta = getWeatherMeta(weather.weather[0].icon);

  return `
    <div class="weather-card" data-region="${regionName}">
      <div class="weather-header">
        <span class="weather-location">📍 ${regionName}</span>
        <span class="weather-icon" aria-hidden="true">${meta.icon}</span>
      </div>
      <div class="weather-body">
        <p class="weather-condition">
          <strong>${meta.label}</strong>
        </p>
        <p class="weather-temp">🌡️ ${Math.round(weather.main.temp)}°C</p>
        <p class="weather-wind">💨 Wind: ${weather.wind.speed} m/s</p>
        <p class="weather-advice">💡 ${meta.advice}</p>
      </div>
      ${renderLastViewedWeather(regionName)}
    </div>
  `;
}

function renderLastViewedWeather(region) {
  try {
    const key = `farmcrib_weather_${region}`;
    const data = localStorage.getItem(key);
    if (!data) return '';
    const parsed = JSON.parse(data);
    const date = new Date(parsed.checkedAt).toLocaleString();
    return `<p class="weather-updated" style="font-size:0.8rem;color:#666;margin-top:8px;">Last updated: ${date}</p>`;
  } catch {
    return '';
  }
}

export function saveWeatherCheck(region) {
  const key = `farmcrib_weather_${region}`;
  localStorage.setItem(key, JSON.stringify({ checkedAt: new Date().toISOString() }));
}

const REGION_QUERIES = {
  'Kaduna': 'Kaduna,NG',
  'Lagos': 'Lagos,NG',
  'Abuja': 'Abuja,NG',
  'Oyo (Ibadan)': 'Ibadan,NG',
  'Kano': 'Kano,NG',
  'Enugu': 'Enugu,NG',
  'Ebonyi': 'Abakaliki,NG',
  'Plateau (Jos)': 'Jos,NG',
  'Rivers (Port Harcourt)': 'Port Harcourt,NG',
  'Kwara (Ilorin)': 'Ilorin,NG',
  'Kebbi (Birnin Kebbi)': 'Birnin Kebbi,NG',
  'Benue (Makurdi)': 'Makurdi,NG',
  'Nasarawa (Lafia)': 'Lafia,NG',
  'Ogun (Abeokuta)': 'Abeokuta,NG'
};

export async function initWeatherPage() {
  const select = document.getElementById('region-select');
  const button = document.getElementById('check-weather');
  const results = document.getElementById('weather-results');
  const loading = document.getElementById('weather-loading');

  if (!select || !button || !results) return;

  button.addEventListener('click', async () => {
    const region = select.value;
    if (!region) return;

    loading.style.display = 'block';
    results.innerHTML = '';

    try {
      const query = REGION_QUERIES[region];
      if (!query) throw new Error('Region not found');

      const weather = await fetchWeather(query);
      results.innerHTML = createWeatherCard(region, weather);
      saveWeatherCheck(region);
    } catch (err) {
      results.innerHTML = `
        <div class="error-message" role="alert">
          <p><strong>Unable to load weather data.</strong></p>
          <p><small>${err.message}</small></p>
        </div>
      `;
    }

    loading.style.display = 'none';
  });

  const firstRegion = Object.keys(REGION_QUERIES)[0];
  if (firstRegion && results) {
    loading.style.display = 'block';
    try {
      const query = REGION_QUERIES[firstRegion];
      const weather = await fetchWeather(query);
      results.innerHTML = createWeatherCard(firstRegion, weather);
    } catch (err) {
      console.warn('Could not auto-load weather:', err);
    }
    loading.style.display = 'none';
  }
}