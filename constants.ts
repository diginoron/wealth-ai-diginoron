
import { WeatherCondition } from './types';

// Based on WMO Weather Interpretation Codes (WW) from Open-Meteo documentation
export const WEATHER_CODE_MAP: Map<number, WeatherCondition> = new Map([
  [0, { description: 'Clear sky', icon: '☀️' }],
  [1, { description: 'Mainly clear', icon: '🌤️' }],
  [2, { description: 'Partly cloudy', icon: '⛅' }],
  [3, { description: 'Overcast', icon: '☁️' }],
  [45, { description: 'Fog', icon: '🌫️' }],
  [48, { description: 'Depositing rime fog', icon: '🌫️' }],
  [51, { description: 'Light Drizzle', icon: '🌦️' }],
  [53, { description: 'Moderate Drizzle', icon: '🌧️' }],
  [55, { description: 'Dense Drizzle', icon: '🌧️' }],
  [56, { description: 'Light Freezing Drizzle', icon: '🥶🌧️' }],
  [57, { description: 'Dense Freezing Drizzle', icon: '🥶🌧️' }],
  [61, { description: 'Slight Rain', icon: '☔' }],
  [63, { description: 'Moderate Rain', icon: '☔' }],
  [65, { description: 'Heavy Rain', icon: '⛈️' }],
  [66, { description: 'Light Freezing Rain', icon: '🥶☔' }],
  [67, { description: 'Heavy Freezing Rain', icon: '🥶☔' }],
  [71, { description: 'Slight Snow fall', icon: '🌨️' }],
  [73, { description: 'Moderate Snow fall', icon: '🌨️' }],
  [75, { description: 'Heavy Snow fall', icon: '🌨️' }],
  [77, { description: 'Snow grains', icon: '❄️' }],
  [80, { description: 'Slight Rain showers', icon: '驟雨' }],
  [81, { description: 'Moderate Rain showers', icon: '驟雨' }],
  [82, { description: 'Violent Rain showers', icon: '暴雨' }],
  [85, { description: 'Slight Snow showers', icon: '🌨️' }],
  [86, { description: 'Heavy Snow showers', icon: '🌨️' }],
  [95, { description: 'Thunderstorm', icon: '⚡' }],
  [96, { description: 'Thunderstorm with slight hail', icon: '⛈️' }],
  [99, { description: 'Thunderstorm with heavy hail', icon: '⛈️' }],
]);

export const DEFAULT_LATITUDE = 35.6892; // Tehran, Iran
export const DEFAULT_LONGITUDE = 51.3890;
