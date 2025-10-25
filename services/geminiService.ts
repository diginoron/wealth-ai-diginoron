import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { WeatherApiResponse } from '../types';
import { WEATHER_CODE_MAP } from '../constants';

// Declare window.GEMINI_API_KEY to avoid TypeScript errors
declare global {
  interface Window {
    GEMINI_API_KEY: string;
  }
}

/**
 * Generates a one-paragraph weather interpretation using the Gemini AI model.
 * @param weatherData The weather data object from Open-Meteo.
 * @returns A Promise that resolves to the AI-generated interpretation string.
 * @throws An error if the Gemini API call fails.
 */
export async function generateWeatherInterpretation(
  weatherData: WeatherApiResponse
): Promise<string> {
  // Get API key from the globally injected variable
  const apiKey = window.GEMINI_API_KEY;

  // Validate API key to provide a helpful error message
  if (!apiKey || apiKey === "GEMINI_API_KEY_PLACEHOLDER") {
    throw new Error("Google Gemini API Key is not configured. Please ensure it's set in Vercel environment variables and the build command is correctly configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const { current_weather, daily, timezone } = weatherData;

  const currentCondition = WEATHER_CODE_MAP.get(current_weather.weathercode);
  const promptParts: string[] = [];

  // Current Weather
  promptParts.push(
    `لطفاً یک پاراگراف تفسیر آب و هوا به زبان فارسی ارائه دهید، که بر اساس اطلاعات زیر باشد و به شرایط کلیدی و روندهای کلی آب و هوا تمرکز کند.`,
    `آب و هوای فعلی در منطقه زمانی ${timezone}:`,
    `دما: ${current_weather.temperature}°C، وضعیت: ${currentCondition?.description || 'نامعلوم'} ${currentCondition?.icon || ''}،`,
    `سرعت باد: ${current_weather.windspeed} کیلومتر بر ساعت از جهت ${current_weather.winddirection} درجه.`,
    ` `
  );

  // Daily Forecast
  promptParts.push(`پیش‌بینی ${daily.time.length} روز آینده (دما بر حسب سانتی‌گراد، بارش بر حسب میلی‌متر):`);
  daily.time.forEach((timeStr, index) => {
    const date = new Date(timeStr);
    const dayOfWeek = date.toLocaleDateString('fa-IR', { weekday: 'long' }); // Use 'fa-IR' for Persian day names
    const weatherCode = daily.weather_code[index];
    const maxTemp = daily.temperature_2m_max[index];
    const minTemp = daily.temperature_2m_min[index];
    const precipitation = daily.precipitation_sum[index];
    const condition = WEATHER_CODE_MAP.get(weatherCode);

    promptParts.push(
      `${dayOfWeek}: حداکثر ${maxTemp}°C، حداقل ${minTemp}°C، وضعیت: ${condition?.description || 'نامعلوم'} ${condition?.icon || ''}، بارش: ${precipitation} میلی‌متر`
    );
  });

  const fullPrompt = promptParts.join('\n');

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Model for basic text tasks
      contents: fullPrompt,
      config: {
        // No responseMimeType or responseSchema as per guidelines for simple text generation
        // No thinkingBudget unless specifically needed for complex reasoning, default is fine for a summary.
      }
    });

    const interpretation = response.text;
    if (!interpretation) {
      throw new Error("AI did not return a valid interpretation.");
    }
    return interpretation.trim();
  } catch (error) {
    console.error("Error generating AI interpretation:", error);
    // Provide a more user-friendly error message if it's an API key issue
    if (error instanceof Error && error.message.includes('API Key is not configured')) {
        throw new Error('Google Gemini API Key is missing or invalid. Please check your Vercel project environment variables and build command.');
    }
    throw new Error(`Failed to get AI interpretation: ${(error as Error).message}`);
  }
}