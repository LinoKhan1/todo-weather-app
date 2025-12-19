"use client";

import { useEffect, useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { LuSunMedium } from "react-icons/lu";

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
    <section className="relative max-w-4xl my-8 rounded-[25px] bg-weather-gradient p-6 mx-6.25 md:mx-auto overflow-hidden">
      {/* Symmetric Decorative Circles with Sun */}
      <div className="absolute -top-[30%] md:-top-[60%] right-12.5 md:right-25 flex items-center ">
        <div className="relative">
          <div className=" w-36 h-36 md:w-72 md:h-73 rounded-full bg-white opacity-[0.23]" />
          <div className="absolute top-1/2 left-1/2  w-28  h-28 md:w-56 md:h-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-[0.28]" />
          <div className="absolute top-1/2 left-1/2 w-20 h-20 md:w-40 md:h-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FCE588]" />
        </div>

        <LuSunMedium className="w-12.5 h-12.5 md:w-25 md:h-25 text-white mt-25 md:mt-50  -ml-4 md:-ml-8" />
      </div>

      <div className="relative text-center md:text-left z-10 flex flex-col md:flex-row items-center pt-10 mx-auto md:ml-17.5 text-white">
        {/* Temperature */}
        <div className="flex items-start">
          <span className="text-[100px] md:text-[180px] leading-none">
            {weather.temperature}
          </span>
          <span className="text-[50px] md:text-[80px] leading-none mt-1 md:mt-4 ml-1">°</span>
        </div>

        {/* Date & Location */}
        <div className="mt-4 md:mt-14 flex flex-col justify-center md:ml-4">
          {/* Date */}
          <div className="text-xl md:text-2xl ml-2 mb-2 md:ml-0">{date}</div>

          {/* Location */}
          <div className="flex items-center gap-2 text-xl md:text-2xl">
            <MapPinIcon className="w-6 h-6 md:w-7.5 md:h-7.5" />
            <span>
              {weather.city}, {weather.country}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
