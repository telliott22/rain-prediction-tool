"use client";

import { useState, useEffect } from "react";

export default function RainChecker() {
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<{
    hourly?: {
      time: string[];
      rain?: number[];
      showers?: number[];
      precipitation_probability?: number[];
    };
    current_weather?: {
      temperature: number;
      windspeed: number;
      weather_code: number;
    };
  } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    // Check for URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const lat = urlParams.get('lat');
    const lng = urlParams.get('lng');
    
    if (lat && lng) {
      const coords = { lat: parseFloat(lat), lng: parseFloat(lng) };
      setLocation(coords);
      setLoading(false);
      fetchWeatherData(coords);
      return;
    }

    // If no URL params, detect location via IP
    const detectLocationFromIP = async () => {
      try {
        // Using ipapi.co for IP geolocation (free tier available)
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const coords = { lat: data.latitude, lng: data.longitude };
        setLocation(coords);
        setLoading(false);
        fetchWeatherData(coords);
      } catch (error) {
        console.error('Failed to detect location:', error);
        setLoading(false);
      }
    };
    
    detectLocationFromIP();
  }, []);

  const fetchWeatherData = async (coords: {lat: number, lng: number}) => {
    setWeatherLoading(true);
    try {
      // Using Open-Meteo API for weather data (no API key required, CORS friendly)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&hourly=rain,showers,precipitation_probability,weather_code&current_weather=true&timezone=auto`
      );
      const data = await response.json();
      setWeatherData(data);
      console.log('Weather data:', data);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const shareLocation = () => {
    if (location) {
      const shareUrl = `${window.location.origin}?lat=${location.lat}&lng=${location.lng}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Location link copied to clipboard!');
    }
  };

  // Helper functions to interpret weather data
  const getRainStatus = () => {
    if (!weatherData || !weatherData.hourly) return null;
    
    const now = new Date();
    const currentHour = now.getHours();
    const hourlyData = weatherData.hourly;
    const times = hourlyData.time;
    const rain = hourlyData.rain || [];
    const showers = hourlyData.showers || [];
    const precipitation_probability = hourlyData.precipitation_probability || [];
    
    // Find current hour index
    const currentIndex = times.findIndex((time: string) => {
      const timeHour = new Date(time).getHours();
      return timeHour === currentHour;
    });
    
    if (currentIndex === -1) return null;
    
    // Check current and next hour
    const currentRain = (rain[currentIndex] || 0) + (showers[currentIndex] || 0);
    const nextHourRain = currentIndex + 1 < rain.length ? 
      (rain[currentIndex + 1] || 0) + (showers[currentIndex + 1] || 0) : 0;
    const currentProbability = precipitation_probability[currentIndex] || 0;
    
    return {
      currentlyRaining: currentRain > 0.1, // More than 0.1mm/hour
      nextHourRain: nextHourRain > 0.1,
      probability: currentProbability,
      intensity: currentRain
    };
  };

  const getWeatherEmoji = () => {
    if (!weatherData || !weatherData.current_weather) return '☁️';
    const weatherCode = weatherData.current_weather.weather_code;
    
    // WMO Weather codes to emoji mapping
    if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) return '🌧️'; // Rain
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return '🌨️'; // Snow
    if ([0, 1].includes(weatherCode)) return '☀️'; // Clear/mostly clear
    if ([2, 3].includes(weatherCode)) return '⛅'; // Partly cloudy
    if ([45, 48].includes(weatherCode)) return '🌫️'; // Fog
    if ([95, 96, 99].includes(weatherCode)) return '⛈️'; // Thunderstorm
    return '☁️'; // Default cloudy
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
        <div className="text-white text-xl">Detecting your location...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Rain Checker
        </h1>
        
{location ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{weatherLoading ? '☁️' : getWeatherEmoji()}</div>
              {weatherLoading ? (
                <div className="text-2xl font-semibold text-gray-800 mb-2">
                  Checking weather...
                </div>
              ) : (
                <div>
                  {(() => {
                    const rainStatus = getRainStatus();
                    if (!rainStatus) {
                      return (
                        <div className="text-2xl font-semibold text-gray-800 mb-2">
                          Weather data unavailable
                        </div>
                      );
                    }
                    
                    if (rainStatus.currentlyRaining) {
                      return (
                        <div>
                          <div className="text-2xl font-semibold text-red-600 mb-2">
                            It&apos;s raining now! 🌧️
                          </div>
                          <div className="text-lg text-gray-600">
                            Intensity: {rainStatus.intensity.toFixed(1)} mm/hour
                          </div>
                        </div>
                      );
                    } else if (rainStatus.nextHourRain) {
                      return (
                        <div>
                          <div className="text-2xl font-semibold text-orange-600 mb-2">
                            Rain expected within the hour!
                          </div>
                          <div className="text-lg text-gray-600">
                            Bring an umbrella! ☂️
                          </div>
                        </div>
                      );
                    } else if (rainStatus.probability > 30) {
                      return (
                        <div>
                          <div className="text-2xl font-semibold text-yellow-600 mb-2">
                            Possible rain
                          </div>
                          <div className="text-lg text-gray-600">
                            {rainStatus.probability}% chance in the next hour
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <div className="text-2xl font-semibold text-green-600 mb-2">
                            No rain expected! ✅
                          </div>
                          <div className="text-lg text-gray-600">
                            You&apos;re good to go without an umbrella
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
              <div className="text-sm text-gray-600 mt-2">
                Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            </div>

            {weatherData && !weatherLoading && (
              <div className="bg-blue-50 rounded-2xl p-6">
                <div className="text-lg font-semibold text-blue-800 mb-2">
                  Current Weather
                </div>
                <div className="text-gray-700">
                  Temperature: {weatherData.current_weather?.temperature}°C<br/>
                  Wind: {weatherData.current_weather?.windspeed} km/h
                </div>
              </div>
            )}

            <button 
              onClick={shareLocation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Share This Location
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">📍</div>
            <div className="text-xl text-gray-800 mb-4">
              Unable to detect location
            </div>
            <div className="text-sm text-gray-600">
              Please allow location access or check your connection
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
