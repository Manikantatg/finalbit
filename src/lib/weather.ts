import axios from 'axios';
import { WeatherData } from './types';

const API_KEY = '31c9aee2d66d5397d0144a6657061786';
const CITY = 'London,uk';

const MOCK_WEATHER: WeatherData = {
  temp: 22,
  humidity: 60,
  condition: 'Cloudy',
  isDay: true,
};

export const fetchWeather = async (): Promise<WeatherData> => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
    );
    
    const data = response.data;
    const isDay = data.dt > data.sys.sunrise && data.dt < data.sys.sunset;

    return {
      temp: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      isDay,
    };
  } catch (error) {
    console.warn('Weather API fetch failed, using mock data');
    return MOCK_WEATHER;
  }
};
