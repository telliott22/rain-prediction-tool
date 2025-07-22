# Rain Checker

A lightweight, shareable web application that helps people decide whether to take wet weather gear when leaving their house.

## Features

✅ **Implemented**
- **IP-based Location Detection** - Automatically detects user's location via IP geolocation
- **URL Parameter Sharing** - Share specific locations via `?lat=X&lng=Y` parameters
- **Real-time Weather Data** - Uses Open-Meteo API for accurate precipitation forecasts
- **Rain Prediction** - Shows whether it will rain in the next hour at your exact location
- **Responsive Design** - Works on desktop and mobile devices
- **Dynamic Weather Display** - Visual feedback with weather-appropriate emojis

## Core Functionality

The app answers the key question: **"Should I bring an umbrella right now?"**

- **Currently Raining**: Shows intensity and suggests bringing weather protection
- **Rain Expected**: Alerts if rain is expected within the hour
- **Possible Rain**: Shows probability if there's a chance (>30%)
- **No Rain**: Confirms it's safe to go without an umbrella

## Technical Stack

- **Frontend**: Next.js 15+ with TypeScript
- **Styling**: Tailwind CSS 
- **Weather API**: Open-Meteo (no API key required, CORS-friendly)
- **Location**: IP geolocation via ipapi.co
- **Deployment**: Ready for Vercel deployment

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

## Deployment

The app is configured for easy deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. No environment variables required (APIs are free-tier)

## API Usage

### Location Detection
- **Primary**: IP geolocation via ipapi.co (free tier: 1,000 requests/month)
- **Secondary**: URL parameters `?lat=X&lng=Y` for specific locations

### Weather Data
- **API**: Open-Meteo forecast API
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Parameters**: hourly rain, showers, precipitation_probability, weather_code
- **Rate Limits**: No limits for non-commercial use

## Architecture Decisions

### Why Open-Meteo?
- ✅ True CORS support for client-side requests
- ✅ No API key required (simpler deployment)
- ✅ Excellent precipitation data quality
- ✅ Free for non-commercial use
- ✅ Fast response times

### Why Client-Side Only?
- ✅ No backend maintenance
- ✅ Easy deployment and scaling
- ✅ Fast loading times
- ✅ Shareable URLs work instantly
- ✅ Lower hosting costs
