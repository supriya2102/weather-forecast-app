import React, { useEffect, useState } from "react";
import { AtmosphericConditionsSection } from "./sections/AtmosphericConditionsSection/AtmosphericConditionsSection";
import { RecentSearchesSection } from "./sections/RecentSearchesSection/RecentSearchesSection";
import { WeatherInsightsSection } from "./sections/WeatherInsightsSection/WeatherInsightsSection";
import { OneCallWeatherData, AirPollutionData } from "../../types/weather";
import { weatherService } from "../../services/weatherService";
import { geolocationService } from "../../services/geolocationService";
import { storageService } from "../../services/storageService";

export const Artboard = (): JSX.Element => {
  const [weatherData, setWeatherData] = useState<OneCallWeatherData | null>(null);
  const [airPollution, setAirPollution] = useState<AirPollutionData | null>(null);
  const [locationName, setLocationName] = useState<string>("Loading location...");
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (lat: number, lon: number, cityName?: string) => {
    try {
      setError(null);

      const [oneCallData, airPollutionData, currentWeather] = await Promise.all([
        weatherService.getOneCallData(lat, lon),
        weatherService.getAirPollution(lat, lon),
        cityName ? Promise.resolve(null) : weatherService.getCurrentWeatherByCoords(lat, lon)
      ]);

      setWeatherData(oneCallData);
      setAirPollution(airPollutionData);
      setCurrentCoords({ lat, lon });

      if (cityName) {
        setLocationName(cityName);
      } else if (currentWeather) {
        setLocationName(currentWeather.name);
      }

      if (cityName) {
        storageService.addRecentSearch({
          city: cityName,
          lat,
          lon
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      console.error('Error fetching weather data:', err);
    }
  };

  const handleSearch = async (city: string) => {
    try {
      setError(null);
      const currentWeather = await weatherService.getCurrentWeatherByCity(city);
      await fetchWeatherData(currentWeather.coord.lat, currentWeather.coord.lon, currentWeather.name);
    } catch (err) {
      setError('City not found. Please try another location.');
      console.error('Error searching city:', err);
    }
  };

  useEffect(() => {
    const initializeWeather = async () => {
      try {
        const coords = await geolocationService.getCurrentPosition();
        await fetchWeatherData(coords.lat, coords.lon);
      } catch (err) {
        console.error('Geolocation error:', err);
        await fetchWeatherData(13.0827, 80.2707, 'Chennai');
      }
    };

    initializeWeather();
  }, []);

  return (
    <div className="bg-[#ffffff1a] overflow-hidden w-full min-w-[1440px] min-h-[1024px] relative">
      <div className="absolute top-0 left-0 w-[1440px] h-[1024px] shadow-[0px_4px_4px_#00000040] bg-[url(/bg-rectangle.png)] bg-cover bg-[50%_50%]" />

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg z-50 [font-family:'Roboto',Helvetica]">
          {error}
        </div>
      )}

      <div className="flex h-full relative z-10">
        <div className="w-1/3 flex-shrink-0">
          <AtmosphericConditionsSection
            weatherData={weatherData}
            airPollution={airPollution}
            onSearch={handleSearch}
          />
        </div>

        <div className="flex-1 flex flex-col ml-[1%]">
          <div className="h-1/2 flex-shrink-0 mb-[3%]">
            <RecentSearchesSection
              weatherData={weatherData}
              locationName={locationName}
            />
          </div>

          <div className="flex-1">
            <WeatherInsightsSection weatherData={weatherData} />
          </div>
        </div>
      </div>
    </div>
  );
};
