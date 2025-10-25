
import { WeatherApiResponse } from '../types';

/**
 * Fetches weather data from the Open-Meteo API for specified coordinates.
 * @param latitude - The latitude of the location.
 * @param longitude - The longitude of the location.
 * @returns A Promise that resolves to WeatherApiResponse.
 * @throws An error if the network request fails or the response is not OK.
 */
export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherApiResponse> {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${latitude}&longitude=${longitude}&` +
    `hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&` +
    `daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&` +
    `current_weather=true&timezone=auto&forecast_days=7`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.reason || errorData.message || 'Failed to fetch weather data'}`);
    }

    const data: WeatherApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error(`Failed to retrieve weather information: ${(error as Error).message}`);
  }
}
