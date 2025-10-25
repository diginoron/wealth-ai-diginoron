
import React from 'react';
import { Daily } from '../types';
import { WEATHER_CODE_MAP } from '../constants';

interface DailyForecastProps {
  daily: Daily;
  timezone: string;
}

const DailyForecast: React.FC<DailyForecastProps> = ({ daily, timezone }) => {
  if (!daily || daily.time.length === 0) {
    return <p className="text-gray-600">No daily forecast available.</p>;
  }

  const forecastDays = daily.time.slice(1, 8).map((timeStr, index) => {
    const date = new Date(timeStr);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: timezone });
    const weatherCode = daily.weather_code[index + 1]; // +1 because we sliced from index 1
    const maxTemp = daily.temperature_2m_max[index + 1];
    const minTemp = daily.temperature_2m_min[index + 1];
    const precipitation = daily.precipitation_sum[index + 1];
    const weatherCondition = WEATHER_CODE_MAP.get(weatherCode);

    return (
      <div
        key={timeStr}
        className="flex flex-col items-center p-4 bg-white bg-opacity-80 rounded-lg shadow-md hover:bg-opacity-100 transition duration-300 transform hover:scale-105"
      >
        <p className="text-lg font-semibold text-gray-800">{dayOfWeek}</p>
        <p className="text-3xl mt-2">{weatherCondition?.icon || '❓'}</p>
        <p className="text-xs text-gray-600 text-center mt-1">{weatherCondition?.description || 'Unknown'}</p>
        <p className="mt-2 text-gray-700">
          <span className="font-bold text-red-500">{maxTemp}°C</span> /{' '}
          <span className="font-bold text-blue-500">{minTemp}°C</span>
        </p>
        {precipitation > 0 && (
          <p className="text-sm text-blue-600 flex items-center mt-1">
            <span role="img" aria-label="rain">💧</span>
            <span className="ml-1">{precipitation} mm</span>
          </p>
        )}
      </div>
    );
  });

  return (
    <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-lg w-full max-w-4xl mt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">7-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {forecastDays}
      </div>
    </div>
  );
};

export default DailyForecast;
