const axios = require('axios');

const getWeatherData = async (city = 'Jaipur') => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey || apiKey === 'your_api_key_here') {
            console.warn('OpenWeatherMap API Key is missing or default. Using mock data.');
            return getMockData();
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        const response = await axios.get(url);

        return {
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            condition: response.data.weather[0].main,
            location: response.data.name
        };
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.warn('OpenWeatherMap API Key is invalid or not yet active. Using mock data.');
        } else {
            console.error('Error fetching weather data:', error.message);
        }
        return getMockData();
    }
};

const getMockData = () => ({
    temperature: parseFloat((28 + Math.random() * 8).toFixed(1)),  // Jaipur avg: 28–36°C
    humidity: Math.round(35 + Math.random() * 20),                  // Rajasthan: dry 35–55%
    condition: 'Clear',
    location: 'Jaipur'
});

module.exports = { getWeatherData };
