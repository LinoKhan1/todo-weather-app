"use client";

import { useEffect, useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

type WeatherData = {
  temperature: number;
  city: string;
  country: string;
  description?: string;
};

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then((data: WeatherData) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch weather:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-8">Loading weather...</p>;
  if (!weather) return <p className="text-center mt-8">No weather data</p>;

  const date = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <section className="max-w-4xl mt-8 rounded-[25px] bg-gradient-to-r from-[#00D2FF] to-[#3A7BD5] p-6 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Degree */}
        <div className="text-[180px] font-bold text-white">
          {weather.temperature}°
        </div>

        {/* Date & Location */}
        <div className="flex flex-col justify-center text-white space-y-2">
          {/* Date */}
          <div className="text-lg">{date}</div>

          {/* Location with icon */}
          <div className="flex items-center space-x-2 text-2xl font-semibold">
            <MapPinIcon className="h-6 w-6" />
            <span>{`${weather.city}, ${weather.country}`}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
