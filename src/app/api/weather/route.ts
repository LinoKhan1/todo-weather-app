import { NextResponse } from "next/server";

const API_KEY = process.env.OPEN_WEATHER_API_KEY; // must be set in .env
const LAT = "-33.9258";  // sample latitude
const LON = "18.4232";  // sample longitude

export async function GET() {
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
      return NextResponse.json({ error: "Failed to fetch weather" }, { status: 500 });
    }

    const data = await res.json();

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
