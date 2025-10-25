import React, { useState, useEffect, useCallback } from 'react';
import { WeatherApiResponse } from './types';
import { fetchWeatherData } from './services/weatherService';
import { generateWeatherInterpretation } from './services/geminiService'; // Import the new service
import { DEFAULT_LATITUDE, DEFAULT_LONGITUDE } from './constants';
import WeatherCard from './components/WeatherCard';
import DailyForecast from './components/DailyForecast';
import LoadingSpinner from './components/LoadingSpinner';
import AIInsightCard from './components/AIInsightCard'; // Import the new component

const App: React.FC = () => {
  const [latitude, setLatitude] = useState<string>(DEFAULT_LATITUDE.toString());
  const [longitude, setLongitude] = useState<string>(DEFAULT_LONGITUDE.toString());
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [aiInterpretation, setAiInterpretation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatitude(e.target.value);
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLongitude(e.target.value);
  };

  const getAndSetWeatherData = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setAiInterpretation(null); // Clear previous AI interpretation
    setAiError(null); // Clear previous AI error

    let fetchedData: WeatherApiResponse | null = null;
    try {
      fetchedData = await fetchWeatherData(lat, lon);
      setWeatherData(fetchedData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while fetching weather.");
      }
      setWeatherData(null); // Clear previous data on error
    } finally {
      setLoading(false);
    }

    // If weather data was successfully fetched, generate AI interpretation
    if (fetchedData) {
      setAiLoading(true);
      try {
        const interpretation = await generateWeatherInterpretation(fetchedData);
        setAiInterpretation(interpretation);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setAiError(err.message);
        } else {
          setAiError("An unexpected error occurred during AI interpretation.");
        }
        setAiInterpretation(null);
      } finally {
        setAiLoading(false);
      }
    }
  }, []);

  const handleFetchWeather = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLat = parseFloat(latitude);
    const parsedLon = parseFloat(longitude);

    if (isNaN(parsedLat) || isNaN(parsedLon)) {
      setError('Please enter valid numbers for latitude and longitude.');
      setWeatherData(null);
      setAiInterpretation(null); // Clear AI interpretation on input error
      return;
    }

    if (parsedLat < -90 || parsedLat > 90 || parsedLon < -180 || parsedLon > 180) {
      setError('Latitude must be between -90 and 90. Longitude must be between -180 and 180.');
      setWeatherData(null);
      setAiInterpretation(null); // Clear AI interpretation on input error
      return;
    }

    getAndSetWeatherData(parsedLat, parsedLon);
  };

  // Fetch initial weather data on component mount
  useEffect(() => {
    getAndSetWeatherData(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs only once on mount.

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 min-h-screen w-full font-sans">
      <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-5xl text-gray-800 flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-indigo-700 mb-8 mt-4">
          Weather Forecast
        </h1>

        <form onSubmit={handleFetchWeather} className="w-full max-w-md mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="latitude" className="block text-gray-700 text-sm font-bold mb-2">
                Latitude:
              </label>
              <input
                id="latitude"
                type="text"
                value={latitude}
                onChange={handleLatitudeChange}
                placeholder="e.g., 35.6892"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="longitude" className="block text-gray-700 text-sm font-bold mb-2">
                Longitude:
              </label>
              <input
                id="longitude"
                type="text"
                value={longitude}
                onChange={handleLongitudeChange}
                placeholder="e.g., 51.3890"
                className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || aiLoading}
            className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition duration-300 transform hover:scale-105
                        ${(loading || aiLoading) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {(loading || aiLoading) ? 'Fetching & Analyzing...' : 'Get Weather'}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative w-full max-w-md text-center" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading && <LoadingSpinner />}

        {weatherData && !loading && !error && (
          <div className="flex flex-col items-center w-full mt-6 space-y-8">
            <h2 className="text-3xl font-semibold text-center text-gray-700">
              Weather in {weatherData.latitude.toFixed(2)}, {weatherData.longitude.toFixed(2)}
            </h2>
            <WeatherCard
              currentWeather={weatherData.current_weather}
              timezone={weatherData.timezone}
            />
            <DailyForecast daily={weatherData.daily} timezone={weatherData.timezone} />
            <AIInsightCard
              interpretation={aiInterpretation}
              loading={aiLoading}
              error={aiError}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
