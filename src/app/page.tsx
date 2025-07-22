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

  // Weather theme engine - maps WMO codes to complete visual themes
  const getWeatherTheme = () => {
    if (!weatherData || !weatherData.current_weather) {
      return {
        type: 'default',
        emoji: '☁️',
        background: 'bg-gradient-to-br from-blue-400 to-blue-600',
        cardBg: 'bg-white/90',
        textColor: 'text-gray-800',
        animation: '',
        buttonStyle: 'bg-blue-600 hover:bg-blue-700'
      };
    }
    
    const weatherCode = weatherData.current_weather.weather_code;
    const rainStatus = getRainStatus();
    
    // Rainy weather themes
    if ([61, 63, 65, 80, 81, 82].includes(weatherCode) || (rainStatus && rainStatus.currentlyRaining)) {
      return {
        type: 'rain',
        emoji: '🌧️',
        background: 'bg-gradient-to-br from-gray-700 via-gray-600 to-blue-900',
        cardBg: 'bg-gray-800/90 backdrop-blur-md',
        textColor: 'text-white',
        animation: 'rain-animation',
        buttonStyle: 'bg-blue-500 hover:bg-blue-600 text-white'
      };
    }
    
    // Snowy weather themes
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
      return {
        type: 'snow',
        emoji: '🌨️',
        background: 'bg-gradient-to-br from-blue-100 via-white to-gray-200',
        cardBg: 'bg-white/95 backdrop-blur-sm',
        textColor: 'text-gray-800',
        animation: 'snow-animation',
        buttonStyle: 'bg-blue-400 hover:bg-blue-500 text-white'
      };
    }
    
    // Clear/sunny weather themes
    if ([0, 1].includes(weatherCode)) {
      return {
        type: 'sunny',
        emoji: '☀️',
        background: 'bg-gradient-to-br from-yellow-200 via-orange-200 to-blue-300',
        cardBg: 'bg-white/85 backdrop-blur-sm',
        textColor: 'text-gray-800',
        animation: 'sunny-animation',
        buttonStyle: 'bg-orange-400 hover:bg-orange-500 text-white'
      };
    }
    
    // Partly cloudy weather themes
    if ([2, 3].includes(weatherCode)) {
      return {
        type: 'cloudy',
        emoji: '⛅',
        background: 'bg-gradient-to-br from-gray-300 via-gray-100 to-blue-200',
        cardBg: 'bg-white/90 backdrop-blur-sm',
        textColor: 'text-gray-800',
        animation: 'clouds-animation',
        buttonStyle: 'bg-gray-500 hover:bg-gray-600 text-white'
      };
    }
    
    // Foggy weather themes
    if ([45, 48].includes(weatherCode)) {
      return {
        type: 'fog',
        emoji: '🌫️',
        background: 'bg-gradient-to-br from-gray-400 via-gray-200 to-gray-300',
        cardBg: 'bg-white/80 backdrop-blur-lg',
        textColor: 'text-gray-800',
        animation: 'fog-animation',
        buttonStyle: 'bg-gray-400 hover:bg-gray-500 text-white'
      };
    }
    
    // Thunderstorm weather themes
    if ([95, 96, 99].includes(weatherCode)) {
      return {
        type: 'storm',
        emoji: '⛈️',
        background: 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800',
        cardBg: 'bg-gray-900/90 backdrop-blur-md',
        textColor: 'text-white',
        animation: 'storm-animation',
        buttonStyle: 'bg-purple-600 hover:bg-purple-700 text-white'
      };
    }
    
    // Default cloudy theme
    return {
      type: 'default',
      emoji: '☁️',
      background: 'bg-gradient-to-br from-gray-400 to-gray-600',
      cardBg: 'bg-white/90 backdrop-blur-sm',
      textColor: 'text-gray-800',
      animation: '',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700 text-white'
    };
  };

  // Simplified emoji function using theme engine
  const getWeatherEmoji = () => {
    return getWeatherTheme().emoji;
  };

  // Get current weather theme for dynamic styling
  const currentTheme = getWeatherTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
        <div className="text-white text-xl">Detecting your location...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-1000 ${currentTheme.background} ${currentTheme.animation}`}>
      <div className={`max-w-md w-full rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-all duration-700 ${currentTheme.cardBg}`} style={{ zIndex: 10 }}>
        <h1 className={`text-3xl font-bold text-center mb-6 transition-colors duration-500 ${currentTheme.textColor}`}>
          Rain Checker
        </h1>
        
{location ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">{weatherLoading ? '☁️' : getWeatherEmoji()}</div>
{weatherLoading ? (
                <div className={`text-2xl font-semibold mb-2 transition-colors duration-500 ${currentTheme.textColor}`}>
                  Checking weather...
                </div>
              ) : (
                <div>
                  {(() => {
                    const rainStatus = getRainStatus();
                    if (!rainStatus) {
                      return (
                        <div className={`text-2xl font-semibold mb-2 transition-colors duration-500 ${currentTheme.textColor}`}>
                          Weather data unavailable
                        </div>
                      );
                    }
                    
                    if (rainStatus.currentlyRaining) {
                      return (
                        <div>
                          <div className="text-2xl font-semibold text-red-300 mb-2 drop-shadow-sm">
                            It&apos;s raining now! 🌧️
                          </div>
                          <div className={`text-lg transition-colors duration-500 ${currentTheme.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-600'}`}>
                            Intensity: {rainStatus.intensity.toFixed(1)} mm/hour
                          </div>
                        </div>
                      );
                    } else if (rainStatus.nextHourRain) {
                      return (
                        <div>
                          <div className="text-2xl font-semibold text-orange-400 mb-2 drop-shadow-sm">
                            Rain expected within the hour!
                          </div>
                          <div className={`text-lg transition-colors duration-500 ${currentTheme.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-600'}`}>
                            Bring an umbrella! ☂️
                          </div>
                        </div>
                      );
                    } else if (rainStatus.probability > 30) {
                      return (
                        <div>
                          <div className="text-2xl font-semibold text-yellow-500 mb-2 drop-shadow-sm">
                            Possible rain
                          </div>
                          <div className={`text-lg transition-colors duration-500 ${currentTheme.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-600'}`}>
                            {rainStatus.probability}% chance in the next hour
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <div className="text-2xl font-semibold text-green-400 mb-2 drop-shadow-sm">
                            No rain expected! ✅
                          </div>
                          <div className={`text-lg transition-colors duration-500 ${currentTheme.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-600'}`}>
                            You&apos;re good to go without an umbrella
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
              <div className={`text-sm mt-2 transition-colors duration-500 ${currentTheme.textColor === 'text-white' ? 'text-gray-300' : 'text-gray-600'}`}>
                Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </div>
            </div>

            {weatherData && !weatherLoading && (
              <div className={`rounded-2xl p-6 transition-colors duration-700 ${currentTheme.textColor === 'text-white' ? 'bg-white/10 backdrop-blur-sm' : 'bg-gray-50/80'}`}>
                <div className={`text-lg font-semibold mb-2 transition-colors duration-500 ${currentTheme.textColor}`}>
                  Current Weather
                </div>
                <div className={`transition-colors duration-500 ${currentTheme.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Temperature: {weatherData.current_weather?.temperature}°C<br/>
                  Wind: {weatherData.current_weather?.windspeed} km/h
                </div>
              </div>
            )}

            <button 
              onClick={shareLocation}
              className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-500 hover:shadow-lg transform hover:scale-105 ${currentTheme.buttonStyle}`}
            >
              Share This Location
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">📍</div>
            <div className={`text-xl mb-4 transition-colors duration-500 ${currentTheme.textColor}`}>
              Unable to detect location
            </div>
            <div className={`text-sm transition-colors duration-500 ${currentTheme.textColor === 'text-white' ? 'text-gray-300' : 'text-gray-600'}`}>
              Please allow location access or check your connection
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
