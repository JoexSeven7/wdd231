/**
 * Weather Insights Module
 * Fetches real weather data using Open-Meteo API for Nigerian agricultural regions
 * Author: FarmCrib Development Team
 */

const NIGERIAN_REGIONS = [
  { name: 'Kaduna', lat: 10.5265, lon: 7.4380 },
  { name: 'Lagos', lat: 6.5244, lon: 3.3792 },
  { name: 'Abuja', lat: 9.0765, lon: 7.3986 },
  { name: 'Oyo (Ibadan)', lat: 7.3775, lon: 3.9470 },
  { name: 'Kano', lat: 12.0022, lon: 8.5919 },
  { name: 'Enugu', lat: 6.4589, lon: 7.5421 },
  { name: 'Ebonyi', lat: 6.2667, lon: 8.2167 },
  { name: 'Plateau (Jos)', lat: 9.8965, lon: 8.8583 },
  { name: 'Rivers (Port Harcourt)', lat: 4.8156, lon: 7.0498 },
  { name: 'Kwara (Ilorin)', lat: 8.4799, lon: 4.5418 },
  { name: 'Kebbi (Birnin Kebbi)', lat: 12.4539, lon: 4.2009 },
  { name: 'Benue (Makurdi)', lat: 7.7333, lon: 8.5333 },
  { name: 'Nasarawa (Lafia)', lat: 8.4833, lon: 8.5167 },
  { name: 'Ogun (Abeokuta)', lat: 7.1574, lon: 3.3572 }
];

const WEATHER_CODE_MAP = {
  0: { label: 'Clear sky', icon: '☀️', advice: 'Ideal for harvesting and field preparation.' },
  1: { label: 'Mainly clear', icon: '🌤️', advice: 'Good conditions for most farming activities.' },
  2: { label: 'Partly cloudy', icon: '⛅', advice: 'Suitable for spraying and light field work.' },
  3: { label: 'Overcast', icon: '☁️', advice: 'Monitor humidity; delay harvesting if needed.' },
  45: { label: 'Foggy', icon: '🌫️', advice: 'Avoid spraying operations; poor visibility.' },
  48: { label: 'Depositing rime fog', icon: '🌫️', advice: 'Hold off on field activities until clarity improves.' },
  51: { label: 'Light drizzle', icon: '🌧️', advice: 'Minimal impact; proceed with caution.' },
  53: { label: 'Moderate drizzle', icon: '🌧️', advice: 'Consider switching to covered tasks.' },
  55: { label: 'Dense drizzle', icon: '🌧️', advice: 'Delay spraying; soil may become waterlogged.' },
  61: { label: 'Light rain', icon: '🌧️', advice: 'Good for recently planted seeds; postpone harvesting.' },
  63: { label: 'Moderate rain', icon: '🌧️', advice: 'Avoid top-dressing fertilizer; watch for erosion.' },
  65: { label: 'Heavy rain', icon: '🌧️', advice: 'Flood risk; secure equipment and drainage.' },
  71: { label: 'Light snow', icon: '❄️', advice: 'Not applicable to most Nigerian regions.' },
  73: { label: 'Moderate snow', icon: '❄️', advice: 'Not applicable to most Nigerian regions.' },
  75: { label: 'Heavy snow', icon: '❄️', advice: 'Not applicable to most Nigerian regions.' },
  80: { label: 'Slight rain showers', icon: '🌦️', advice: 'Brief respite possible; plan around showers.' },
  81: { label: 'Moderate rain showers', icon: '🌦️', advice: 'Use covered storage for harvested produce.' },
  82: { label: 'Violent rain showers', icon: '⛈️', advice: 'Postpone all outdoor work; storm risk.' },
  95: { label: 'Thunderstorm', icon: '⛈️', advice: 'Seek shelter; suspend all outdoor farm activities.' },
  96: { label: 'Thunderstorm with hail', icon: '⛈️', advice: 'Extreme caution; protect crops and equipment.' },
  99: { label: 'Thunderstorm with heavy hail', icon: '⛈️', advice: 'All outdoor activity should cease.' }
};

/**
 * Maps Open-Meteo weather code to farmer-friendly label/icon/advice
 */
export function getWeatherMeta(code) {
  return WEATHER_CODE_MAP[code] || { label: 'Unknown', icon: '❓', advice: 'Check local forecasts.' };
}

/**
 * Fetches current weather for a given lat/lon using Open-Meteo
 */
export async function fetchWeather(lat, lon) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.search = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current_weather: 'true',
    timezone: 'Africa/Lagos',
    forecast_days: 1
  });

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Weather fetch failed with status ${res.status}`);
  }

  const json = await res.json();
  return json.current_weather;
}

/**
 * Builds a weather card for one region
 */
export function createWeatherCard(regionName, weather) {
  const meta = getWeatherMeta(weather.weathercode);

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
        <p class="weather-temp">🌡️ ${Math.round(weather.temperature)}°C</p>
        <p class="weather-wind">💨 Wind: ${weather.windspeed} km/h</p>
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

const REGION_COORDS = {
  'Kaduna': { lat: 10.5265, lon: 7.4380 },
  'Lagos': { lat: 6.5244, lon: 3.3792 },
  'Abuja': { lat: 9.0765, lon: 7.3986 },
  'Oyo (Ibadan)': { lat: 7.3775, lon: 3.9470 },
  'Kano': { lat: 12.0022, lon: 8.5919 },
  'Enugu': { lat: 6.4589, lon: 7.5421 },
  'Ebonyi': { lat: 6.2667, lon: 8.2167 },
  'Plateau (Jos)': { lat: 9.8965, lon: 8.8583 },
  'Rivers (Port Harcourt)': { lat: 4.8156, lon: 7.0498 },
  'Kwara (Ilorin)': { lat: 8.4799, lon: 4.5418 },
  'Kebbi (Birnin Kebbi)': { lat: 12.4539, lon: 4.2009 },
  'Benue (Makurdi)': { lat: 7.7333, lon: 8.5333 },
  'Nasarawa (Lafia)': { lat: 8.4833, lon: 8.5167 },
  'Ogun (Abeokuta)': { lat: 7.1574, lon: 3.3572 }
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
      const coords = REGION_COORDS[region];
      if (!coords) throw new Error('Region not found');

      const weather = await fetchWeather(coords.lat, coords.lon);
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

  const firstRegion = Object.keys(REGION_COORDS)[0];
  if (firstRegion && results) {
    loading.style.display = 'block';
    try {
      const coords = REGION_COORDS[firstRegion];
      const weather = await fetchWeather(coords.lat, coords.lon);
      results.innerHTML = createWeatherCard(firstRegion, weather);
    } catch (err) {
      console.warn('Could not auto-load weather:', err);
    }
    loading.style.display = 'none';
  }
}
