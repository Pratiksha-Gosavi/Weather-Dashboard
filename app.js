
const apiKey = '9e4ac357b7d277b2b15bd4185eee6def'; 

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const forecastContainer = document.getElementById('forecastContainer');

const weatherBackgrounds = {
    Clear: 'images/sunny.jpg',
    Clouds: 'images/cloudy.jpg',
    Rain: 'images/rainy.jpg',
    Snow: 'images/snowy.jpg',
    Thunderstorm: 'images/thunderstorm.jpg',
    Drizzle: 'images/drizzle.jpg',
    Mist: 'images/mist.jpg',
    Smoke: 'images/smoke.jpg',
    Haze: 'images/haze.jpg',
    Fog: 'images/fog.jpg',
    Dust: 'images/dust.jpg',
    Sand: 'images/sand1.jpg',
    Ash: 'images/ash.jpg',
    Squall: 'images/squall.jpg',
    Tornado: 'images/tornado.jpg',
};

searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name!');
        return;
    }

    try {
        const currentWeatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!currentWeatherResponse.ok) throw new Error('City not found');
        const currentWeatherData = await currentWeatherResponse.json();

        const { lat, lon } = currentWeatherData.coord;
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        if (!forecastResponse.ok) throw new Error('Forecast data not available');
        const forecastData = await forecastResponse.json();

        updateCurrentWeather(currentWeatherData);
        updateWeeklyForecast(forecastData.list);

        const weatherCondition = currentWeatherData.weather[0].main;
        const backgroundImage = weatherBackgrounds[weatherCondition] || 'images/default.jpg';
        document.body.style.background = `url('${backgroundImage}') no-repeat center center fixed`;
        document.body.style.backgroundSize = 'cover';
    } catch (error) {
        alert(error.message);
    }
});

function updateCurrentWeather(data) {
    const { name, main: { temp }, weather } = data;
    const weatherCondition = weather[0].main;

    cityName.textContent = name;
    temperature.textContent = `Temperature: ${Math.round(temp)}°C`;

    description.textContent = weather[0].description;
}

function updateWeeklyForecast(forecastData) {
    forecastContainer.innerHTML = '';

    const dailyData = forecastData.filter((item, index) => index % 8 === 0);

    dailyData.forEach((day) => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const description = day.weather[0].description;

        const card = document.createElement('div');
        card.className = 'col-6 col-md-4 col-lg-2 text-center';
        card.innerHTML = `
            <div class="card p-3 bg-light">
                <h5>${dayName}</h5>
                <p>${temp}°C</p>
                <p class="text-muted">${description}</p>
            </div>
        `;

        forecastContainer.appendChild(card);
    });
}
