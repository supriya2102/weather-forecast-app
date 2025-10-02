import { Search as SearchIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { OneCallWeatherData, AirPollutionData } from "../../../../types/weather";
import { weatherService } from "../../../../services/weatherService";

interface AtmosphericConditionsSectionProps {
  weatherData: OneCallWeatherData | null;
  airPollution: AirPollutionData | null;
  onSearch: (city: string) => void;
}

export const AtmosphericConditionsSection = ({
  weatherData,
  airPollution,
  onSearch
}: AtmosphericConditionsSectionProps): JSX.Element => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      if (target.value.trim()) {
        onSearch(target.value.trim());
      }
    }
  };

  const currentTemp = weatherData?.current?.temp ? Math.round(weatherData.current.temp) : 21;
  const tempMin = weatherData?.daily?.[0]?.temp?.min || weatherData?.current?.temp || 18;
  const tempMax = weatherData?.daily?.[0]?.temp?.max || weatherData?.current?.temp || 24;
  const deviation = Math.round(Math.abs(tempMax - tempMin));

  const precipitation = weatherData?.hourly?.[0]?.pop
    ? Math.round(weatherData.hourly[0].pop * 100)
    : 0;

  const windSpeedKmh = weatherData?.current?.wind_speed
    ? Math.round(weatherData.current.wind_speed * 3.6)
    : 0;
  const windSpeedMph = Math.round(windSpeedKmh * 0.621371);

  const humidity = weatherData?.current?.humidity || 63;
  const uvi = weatherData?.current?.uvi || 0;
  const uviLevel = weatherService.getUVLevel(uvi);
  const visibilityKm = weatherData?.current?.visibility
    ? Math.round(weatherData.current.visibility / 1000)
    : 9;

  const aqi = airPollution?.list?.[0]?.main?.aqi || 1;
  const aqiData = weatherService.getAQILabel(aqi);

  const sunrise = weatherData?.current?.sunrise
    ? weatherService.formatTime(weatherData.current.sunrise)
    : "5:58 am";
  const sunset = weatherData?.current?.sunset
    ? weatherService.formatTime(weatherData.current.sunset)
    : "5:59 pm";

  const hourlyData = weatherData?.hourly?.slice(0, 12) || [];

  const weatherInsightsData = [
    {
      icon: "/frame-9.svg",
      value: currentTemp.toString(),
      unit: "°C",
      label: "Temperature",
    },
    {
      icon: "/frame-13.svg",
      value: deviation.toString(),
      unit: "°C",
      label: "Deviation",
    },
    {
      icon: "/frame-1.svg",
      value: precipitation.toString(),
      unit: "%",
      label: "Precipitation",
    },
    {
      icon: "/frame-6.svg",
      value: windSpeedMph.toString(),
      unit: "mph",
      label: "Wind Speed",
    },
  ];

  const atmosphericData = [
    {
      icon: "/frame-2.svg",
      value: humidity.toString(),
      unit: "%",
      label: "Humidity",
    },
    {
      icon: "/frame-14.svg",
      value: Math.round(uvi).toString(),
      unit: "",
      label: `UV- ${uviLevel}`,
    },
    {
      icon: "/frame-2.svg",
      value: visibilityKm.toString(),
      unit: "km",
      label: "Visibility",
    },
  ];

  return (
    <div className="w-full h-full flex bg-[#0000004c] rounded-[30px] overflow-hidden">
      <div className="flex mt-6 w-full max-w-[409px] h-[961px] ml-[39px] flex-col items-start gap-6">
        <div className="relative w-full h-[49px] rounded-[24.5px] border-[1.5px] border-solid border-[#ffffffcc]">
          <Input
            placeholder="Search location..."
            onKeyPress={handleKeyPress}
            className="w-full h-full bg-transparent border-none text-white text-sm [font-family:'Roboto',Helvetica] font-normal pl-5 pr-12"
          />
          <SearchIcon className="absolute top-3 right-5 w-6 h-6 text-white" />
        </div>

        <Card className="w-full h-60 bg-[#00000066] border-none rounded-xl overflow-hidden">
          <CardContent className="p-0 h-full flex items-center justify-center">
            <div className="w-[377px] h-[197px] flex flex-col gap-[19px]">
              <div className="flex items-center justify-center w-[183px] h-[28.01px] [font-family:'Roboto',Helvetica] font-bold text-white text-lg tracking-[0] leading-[normal]">
                Weather Insights
              </div>

              <div className="w-[375px] h-[150px] grid grid-cols-2 gap-4">
                {weatherInsightsData.map((item, index) => (
                  <div key={index} className="flex items-center gap-[9px]">
                    <img
                      className="w-6 h-6"
                      alt="Weather icon"
                      src={item.icon}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-baseline">
                        <span className="[font-family:'Roboto',Helvetica] font-bold text-[#ffffffcc] text-[32px] tracking-[0] leading-[normal]">
                          {item.value}
                        </span>
                        <span className="[font-family:'Roboto',Helvetica] font-normal text-[#b8b8b8cc] text-lg tracking-[0] leading-[normal]">
                          {item.unit}
                        </span>
                      </div>
                      <div className="[font-family:'Roboto',Helvetica] font-normal text-white text-lg tracking-[0] leading-[normal] whitespace-nowrap">
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full h-[300px] bg-[#00000066] border-none rounded-xl overflow-hidden">
          <CardContent className="p-[17px] h-full">
            <div className="w-full h-full flex flex-col gap-6">
              <div className="[font-family:'Roboto',Helvetica] font-bold text-white text-lg tracking-[0] leading-[normal]">
                Atmospheric Conditions
              </div>

              <div className="flex gap-[15px]">
                {atmosphericData.map((item, index) => (
                  <Card
                    key={index}
                    className="w-[110px] h-[123px] bg-[#00000040] border-none rounded-[7px] overflow-hidden"
                  >
                    <CardContent className="p-0 pt-[18px] pl-3.5 h-full">
                      <div className="w-[58px] h-[88px] flex flex-col gap-[5px]">
                        <img
                          className="w-6 h-6"
                          alt="Condition icon"
                          src={item.icon}
                        />
                        <div className="flex flex-col gap-[5px]">
                          <div className="flex items-baseline">
                            <span className="[font-family:'Roboto',Helvetica] font-bold text-white text-[32px] tracking-[0] leading-[normal]">
                              {item.value}
                            </span>
                            {item.unit && (
                              <span className="[font-family:'Roboto',Helvetica] font-normal text-[#b8b8b8cc] text-sm tracking-[0] leading-[normal]">
                                {item.unit}
                              </span>
                            )}
                          </div>
                          <div className="[font-family:'Roboto',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                            {item.label}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="w-full h-[86px] bg-[#00000066] border-none rounded-[7px]">
                <CardContent className="p-4 h-full">
                  <div className="w-full h-[54px] flex gap-3.5">
                    <div className="w-[69px] h-[54px] flex flex-col">
                      <div className="flex items-center gap-1">
                        <img
                          className="w-6 h-6"
                          alt="Air quality icon"
                          src="/frame-5.svg"
                        />
                        <span className="[font-family:'Roboto',Helvetica] font-bold text-[#ffffffcc] text-[32px] tracking-[0] leading-[normal]">
                          {aqi}
                        </span>
                      </div>
                      <div className="[font-family:'Roboto',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                        AQI
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="flex items-center gap-1">
                        <div
                          className="w-[7px] h-[7px] rounded-[3.5px]"
                          style={{ backgroundColor: aqiData.color }}
                        />
                        <Badge
                          variant="secondary"
                          className="bg-transparent border-none p-0 h-auto"
                        >
                          <span className="[font-family:'Roboto',Helvetica] font-bold text-[#d4d4d4cc] text-sm tracking-[0] leading-[normal]">
                            {aqiData.label}
                          </span>
                        </Badge>
                      </div>
                      <div className="[font-family:'Roboto',Helvetica] font-normal text-white text-sm tracking-[0] leading-[18px]">
                        {aqiData.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full h-[300px] bg-[#00000066] border-none rounded-xl overflow-hidden">
          <CardContent className="p-0 h-full flex items-center justify-center">
            <div className="flex flex-col w-[375px] items-start gap-3.5">
              <div className="[font-family:'Roboto',Helvetica] font-bold text-white text-lg tracking-[0] leading-[normal]">
                Sunrise & Sunset
              </div>

              <Card className="w-[360px] h-[86px] bg-[#00000099] border-none rounded-[7px] overflow-hidden">
                <CardContent className="p-3.5 h-full">
                  <div className="w-full h-[60px] relative">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-[5px]">
                        <img
                          className="w-6 h-6"
                          alt="Sunrise icon"
                          src="/frame-11.svg"
                        />
                        <span className="[font-family:'Roboto',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal]">
                          Sunrise
                        </span>
                      </div>
                      <div className="flex items-center gap-[5px]">
                        <img
                          className="w-6 h-6"
                          alt="Sunset icon"
                          src="/frame.svg"
                        />
                        <span className="[font-family:'Roboto',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal]">
                          Sunset
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between mt-[22px]">
                      <span className="[font-family:'Roboto',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal]">
                        {sunrise}
                      </span>
                      <span className="[font-family:'Roboto',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal]">
                        {sunset}
                      </span>
                    </div>

                    <div className="absolute top-[30px] left-0 w-full h-1.5 rounded bg-[linear-gradient(90deg,rgba(255,223,40,1)_0%,rgba(88,50,50,1)_59%)]" />
                    <div className="absolute top-[22px] left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[#fcdc28] rounded-xl blur-[3.5px]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="w-[360px] h-[113px] bg-[#00000099] border-none rounded-[7px] overflow-hidden">
                <CardContent className="p-0 h-full relative">
                  {hourlyData.slice(0, 4).map((hour, index) => (
                    <div
                      key={index}
                      className="absolute"
                      style={{
                        left: '14px',
                        top: `${2 + index * 23}px`
                      }}
                    >
                      <span className="[font-family:'Inter',Helvetica] text-xs font-normal text-white tracking-[0] leading-[normal]">
                        {weatherService.formatTime(hour.dt)}
                      </span>
                    </div>
                  ))}

                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[296px] h-[97px] flex flex-col gap-[5px]">
                    <svg className="h-[78px] w-[296px]" viewBox="0 0 296 78">
                      <defs>
                        <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                          <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                        </linearGradient>
                      </defs>

                      {hourlyData.length >= 2 && (
                        <>
                          <polyline
                            fill="url(#tempGradient)"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="2"
                            points={
                              hourlyData.slice(0, 12).map((hour, index) => {
                                const x = (index / 11) * 276 + 10;
                                const tempRange = 20;
                                const minTemp = Math.min(...hourlyData.slice(0, 12).map(h => h.temp)) - 5;
                                const normalizedTemp = ((hour.temp - minTemp) / tempRange) * 50;
                                const y = 68 - normalizedTemp;
                                return `${x},${y}`;
                              }).join(' ') + ` 286,78 10,78`
                            }
                          />
                        </>
                      )}
                    </svg>
                    <div className="flex items-center justify-between w-[277px] h-[15px] ml-[11px]">
                      {hourlyData.slice(0, 7).map((hour, index) => (
                        <span
                          key={index}
                          className="[font-family:'Inter',Helvetica] font-normal text-white text-xs tracking-[0] leading-[normal]"
                        >
                          {Math.round(hour.temp)}°
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
