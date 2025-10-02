import { WeatherData, OneCallWeatherData, AirPollutionData } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const ONE_CALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';

export const weatherService = {
  async getCurrentWeatherByCity(city: string): Promise<WeatherData> {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('City not found');
    }

    return response.json();
  },

  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    return response.json();
  },

  async getOneCallData(lat: number, lon: number): Promise<OneCallWeatherData> {
    const response = await fetch(
      `${ONE_CALL_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch One Call data');
    }

    return response.json();
  },

  async getAirPollution(lat: number, lon: number): Promise<AirPollutionData> {
    const response = await fetch(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch air pollution data');
    }

    return response.json();
  },

  getUVLevel(uvi: number): string {
    if (uvi <= 2) return 'Low';
    if (uvi <= 5) return 'Moderate';
    if (uvi <= 7) return 'High';
    if (uvi <= 10) return 'Very High';
    return 'Extreme';
  },

  getAQILabel(aqi: number): { label: string; description: string; color: string } {
    switch (aqi) {
      case 1:
        return {
          label: 'Good',
          description: 'The quality of the air is good in this location.',
          color: '#00d419'
        };
      case 2:
        return {
          label: 'Fair',
          description: 'Air quality is acceptable for most people.',
          color: '#84cf33'
        };
      case 3:
        return {
          label: 'Moderate',
          description: 'Sensitive individuals should limit outdoor activity.',
          color: '#ffb700'
        };
      case 4:
        return {
          label: 'Poor',
          description: 'Everyone may experience health effects.',
          color: '#ff6a00'
        };
      case 5:
        return {
          label: 'Very Poor',
          description: 'Health alert: everyone may be affected.',
          color: '#ff0000'
        };
      default:
        return {
          label: 'Unknown',
          description: 'Air quality data unavailable.',
          color: '#888888'
        };
    }
  },

  formatTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  },

  formatDateTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;

    return `${day} ${dayName}, ${month} ${year} ${formattedHours}:${minutes}${ampm}`;
  },

  getDayName(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }
};
