import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { OneCallWeatherData } from "../../../../types/weather";
import { weatherService } from "../../../../services/weatherService";
import { storageService } from "../../../../services/storageService";

interface RecentSearchesSectionProps {
  weatherData: OneCallWeatherData | null;
  locationName: string;
}

export const RecentSearchesSection = ({ weatherData, locationName }: RecentSearchesSectionProps): JSX.Element => {
  const [recentSearches, setRecentSearches] = useState<Array<{
    city: string;
    temp: number;
    description: string;
  }>>([]);

  useEffect(() => {
    const searches = storageService.getRecentSearches();

    const loadRecentWeather = async () => {
      const searchData = await Promise.all(
        searches.slice(0, 2).map(async (search) => {
          try {
            const data = await weatherService.getCurrentWeatherByCoords(search.lat, search.lon);
            return {
              city: search.city,
              temp: Math.round(data.main.temp),
              description: data.weather[0].description
            };
          } catch (error) {
            return null;
          }
        })
      );

      setRecentSearches(searchData.filter((s): s is NonNullable<typeof s> => s !== null));
    };

    if (searches.length > 0) {
      loadRecentWeather();
    }
  }, [locationName]);

  const currentTemp = weatherData?.current?.temp ? Math.round(weatherData.current.temp) : 21;
  const currentDescription = weatherData?.current?.weather[0]?.description || "Cloudy skies";
  const currentDateTime = weatherService.formatDateTime(weatherData?.current?.dt || Date.now() / 1000);

  const hourlyForecast = weatherData?.hourly?.slice(0, 12) || [];
  const forecastText = hourlyForecast.length > 0
    ? hourlyForecast[0].weather[0].description
    : "Heavy rain with storm";

  return (
    <section className="w-full h-auto bg-[#00000066] flex rounded-[30px] overflow-hidden p-6 gap-14">
      <div className="flex flex-col w-[290px] h-auto">
        <div className="flex w-full h-[120px] items-center gap-[9px]">
          <img className="w-6 h-6" alt="Weather icon" src="/frame-9.svg" />
          <div className="flex-1">
            <div className="flex items-baseline">
              <span className="[font-family:'Roboto',Helvetica] font-bold text-[#ffffffcc] text-[64px] leading-[75px]">
                {currentTemp}
              </span>
              <span className="[font-family:'Roboto',Helvetica] text-[#b8b8b8cc] text-2xl">
                °C
              </span>
            </div>
            <div className="[font-family:'Roboto',Helvetica] text-lg text-white font-normal">
              {currentDateTime}
            </div>
          </div>
        </div>

        <div className="flex w-full h-[120px] items-center gap-[9px] mt-[23px]">
          <img
            className="w-6 h-6"
            alt="Weather forecast icon"
            src="/frame-4.svg"
          />
          <div className="flex-1">
            <div className="[font-family:'Roboto',Helvetica] font-medium text-white text-xs mb-1">
              weather forecast
            </div>
            <div className="[font-family:'Roboto',Helvetica] font-bold text-[#ffffffad] text-2xl">
              {forecastText}
            </div>
          </div>
        </div>

        <div className="w-full mt-6">
          <div className="[font-family:'Roboto',Helvetica] font-medium text-white text-xs mb-[19px]">
            Recent Searched
          </div>
          <div className="flex gap-[14px]">
            {recentSearches.length > 0 ? (
              recentSearches.map((item, index) => (
                <Card
                  key={index}
                  className="w-[138px] h-[154px] bg-[#00000040] border-none"
                >
                  <CardContent className="p-4 h-full flex flex-col justify-between">
                    <img
                      className="w-6 h-6"
                      alt="Location weather icon"
                      src="/frame-2.svg"
                    />
                    <div className="flex items-baseline">
                      <span className="[font-family:'Roboto',Helvetica] font-bold text-[#ffffffcc] text-[32px]">
                        {item.temp}
                      </span>
                      <span className="[font-family:'Roboto',Helvetica] text-[#b8b8b8cc] text-lg">
                        °C
                      </span>
                    </div>
                    <div className="[font-family:'Roboto',Helvetica] font-normal text-white text-sm">
                      {item.city}
                    </div>
                    <div className="[font-family:'Roboto',Helvetica] font-normal text-[#9d9d9d] text-xs">
                      {item.description}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="[font-family:'Roboto',Helvetica] font-normal text-white text-sm">
                No recent searches
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col w-[345px] h-auto mt-[201px] gap-[5px]">
        <div className="flex items-start gap-[3px] w-full">
          <img
            className="w-6 h-6 mt-[7px]"
            alt="Location icon"
            src="/frame-3.svg"
          />
          <h2 className="[font-family:'Roboto',Helvetica] font-normal text-white text-[32px] leading-[38px]">
            {locationName}
          </h2>
        </div>
        <p className="[font-family:'Roboto',Helvetica] font-normal text-white text-sm leading-[22px] w-[343px]">
          {currentDescription.charAt(0).toUpperCase() + currentDescription.slice(1)}.
          {weatherData?.hourly && weatherData.hourly.length > 0 && (
            <> High near {Math.round(weatherData.daily?.[0]?.temp?.max || weatherData.current.temp)}°C.
            Winds {Math.round(weatherData.current.wind_speed * 3.6)} km/h.
            Chance of rain {Math.round((weatherData.hourly[0]?.pop || 0) * 100)}%.</>
          )}
        </p>
      </div>
    </section>
  );
};
