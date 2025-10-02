import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";
import { OneCallWeatherData } from "../../../../types/weather";
import { weatherService } from "../../../../services/weatherService";

interface WeatherInsightsSectionProps {
  weatherData: OneCallWeatherData | null;
}

export const WeatherInsightsSection = ({ weatherData }: WeatherInsightsSectionProps): JSX.Element => {
  const dailyData = weatherData?.daily?.slice(0, 7) || [];
  const todayTimestamp = Math.floor(Date.now() / 1000);
  const todayDayName = weatherService.getDayName(todayTimestamp);

  const weekData = dailyData.map((day, index) => {
    const dayName = weatherService.getDayName(day.dt);
    const temp = Math.round(day.temp.day);
    const isToday = dayName === todayDayName && index === 0;

    return {
      day: dayName,
      temp,
      isToday
    };
  });

  while (weekData.length < 7) {
    weekData.push({
      day: '---',
      temp: 0,
      isToday: false
    });
  }

  return (
    <Card className="w-full h-[489px] bg-[#000000b2] rounded-[30px] overflow-hidden">
      <CardContent className="flex justify-center items-center h-full p-0">
        <div className="flex mt-[104px] w-[856px] h-[263px] ml-px flex-col items-center gap-7">
          <div className="flex w-[844px] items-center gap-[59px] flex-[0_0_auto]">
            {weekData.map((dayData, index) => (
              <div
                key={index}
                className={`${index === 0 || index === 1 ? 'w-[66px]' : 'w-[74px]'} mt-[-1.00px] [font-family:'Roboto',Helvetica] font-medium text-white text-sm text-center tracking-[0] leading-[normal] ${
                  index === weekData.length - 1 ? "mr-[-12.00px]" : ""
                } ${dayData.isToday ? "relative" : ""}`}
              >
                {dayData.isToday && (
                  <div className="absolute inset-0 bg-[#ffff0033] rounded-md -z-10" />
                )}
                {dayData.day}
              </div>
            ))}
          </div>

          <img
            className="self-stretch w-full h-[165px]"
            alt="Frame"
            src="/frame-26.svg"
          />

          <div className="flex items-center gap-[105px] px-0 py-[5px] self-stretch w-full flex-[0_0_auto]">
            {weekData.map((dayData, index) => (
              <div
                key={index}
                className="w-fit mt-[-1.00px] [font-family:'Roboto',Helvetica] font-normal text-transparent text-sm tracking-[0] leading-[normal] whitespace-nowrap"
              >
                <span className="font-bold text-[#ffffffcc]">
                  {dayData.temp > 0 ? dayData.temp : '--'}
                </span>
                <span className="text-[#b8b8b8cc]">{dayData.temp > 0 ? '°C' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
