
import React from 'react';
import { CurrentWeather } from '../types';
import { WEATHER_CODE_MAP } from '../constants';

interface WeatherCardProps {
  currentWeather: CurrentWeather;
  timezone: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ currentWeather, timezone }) => {
  const weatherCondition = WEATHER_CODE_MAP.get(currentWeather.weathercode);
  const dateTime = new Date(currentWeather.time);
  const formattedTime = dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: timezone });
  const formattedDate = dateTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long', timeZone: timezone });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 w-full max-w-2xl transform transition-all hover:scale-105 duration-300">
      <div className="text-center md:text-left flex-1">
        <h3 className="text-5xl font-bold text-gray-800">{currentWeather.temperature}°C</h3>
        <p className="text-xl text-gray-600 mt-2">{weatherCondition?.description || 'Unknown'}{' '}{weatherCondition?.icon}</p>
        <p className="text-sm text-gray-500 mt-1">{formattedDate} - {formattedTime}</p>
        <p className="text-sm text-gray-500">{timezone}</p>
      </div>
      <div className="flex flex-col items-center md:items-end flex-1 md:space-y-2">
        <div className="text-lg text-gray-700 flex items-center space-x-2">
          <span role="img" aria-label="wind">🌬️</span>
          <span>{currentWeather.windspeed} km/h Wind</span>
        </div>
        <div className="text-lg text-gray-700 flex items-center space-x-2">
          <span role="img" aria-label="direction">🧭</span>
          <span>{currentWeather.winddirection}° Direction</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
