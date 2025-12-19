import { NextResponse } from "next/server";

/**
 * GET /api/weather
 * Fetches current weather data for a fixed location from OpenWeatherMap.
 */
export async function GET() {
  
  const API_KEY = process.env.OPEN_WEATHER_API_KEY; // Required OpenWeatherMap API key
  const LAT = "-33.9258"; // Cape Town latitude
  const LON = "18.4232"; // Cape Town longitude

  // Ensure API key is provided
  if (!API_KEY) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("OpenWeatherMap response error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch weather" },
        { status: 500 }
      );
    }

    const data = await res.json();

    // Extract relevant weather information
    const weather = {
      temperature: Math.round(data.main.temp),
      city: data.name,
      country: data.sys.country,
      description: data.weather[0].description,
    };

    return NextResponse.json(weather);
  } catch (err) {
    console.error("Weather API route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
