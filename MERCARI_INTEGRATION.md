# Mercari Japan Bot Analytics Integration

This document explains how the Mercari Japan Bot analytics integration works and how to configure it.

## Overview

The Mercari Japan Bot has been integrated with a specialized analytics system that displays real-time monitoring data from your FastAPI backend. This integration provides:

- Real-time listing monitoring statistics
- Notification tracking
- Alert management metrics
- API performance monitoring
- Subscription tier distribution
- Top commands usage

## Architecture

### Frontend Components

1. **API Service** (`src/services/api.js`)
   - `getMercariAnalytics()` - Fetches raw analytics from FastAPI
   - `getBotStatsEnhanced(botId)` - Returns bot-specific stats with Mercari enhancements
   - `getBotAnalyticsEnhanced(botId, timeRange)` - Returns analytics charts for Mercari

2. **BotAnalytics Component** (`src/components/BotAnalytics.jsx`)
   - Automatically detects when displaying Mercari bot (`botId === 'mercari-japan-bot'`)
   - Shows additional Mercari-specific metrics section
   - Displays subscription tier distribution

### Backend Requirements

Your FastAPI backend should expose a GET endpoint that returns the latest analytics snapshot:

```
GET /analytics/mercari
```

## API Response Format

The frontend expects the following JSON structure from your FastAPI endpoint:

```json
{
  "bot_name": "mercarijp_bot",
  "bot_type": "mercari_monitor",
  "timestamp": "2025-01-15T10:30:00Z",
  "analytics": {
    "timestamp": "2025-01-15T10:30:00Z",
    "metrics": {
      "listings_found_total": 1234,
      "listings_found_last_minute": 3,
      "notifications_sent_total": 567,
      "notifications_sent_last_minute": 2,
      "alerts_triggered_total": 89,
      "alerts_triggered_last_minute": 0,
      "api_requests_total": 5432,
      "api_requests_last_minute": 12,
      "api_errors_total": 23,
      "api_errors_last_minute": 0,
      "avg_api_response_time_ms": 87,
      "last_api_response_time_ms": 85,
      "active_servers": 15,
      "active_keywords": 45,
      "active_alerts": 23,
      "database_size": 8934,
      "bot_uptime_seconds": 345678,
      "free_tier_servers": 8,
      "trial_tier_servers": 2,
      "basic_tier_servers": 3,
      "premium_tier_servers": 1,
      "elite_tier_servers": 1,
      "commands_executed_total": 2345,
      "commands_executed_last_minute": 1
    },
    "charts": {
      "listings_per_minute": [/* 60 numbers */],
      "api_requests_per_minute": [/* 60 numbers */],
      "notifications_per_minute": [/* 60 numbers */]
    },
    "top_commands": [
      { "command": "createalert", "count": 45 },
      { "command": "status", "count": 38 },
      { "command": "help", "count": 32 }
    ],
    "top_keywords_searches": [
      { "keyword": "pokemon", "count": 150 }
    ],
    "top_keywords_listings": [
      { "keyword": "pokemon", "count": 450 }
    ],
    "uptime_formatted": "2d 14h 23m"
  }
}
```

## Configuration

### 1. Set up your API URL

Create a `.env.local` file (or `.env`) in the project root:

```bash
VITE_API_BASE_URL=https://your-fastapi-domain.com/api
```

### 2. Backend Endpoint

Your FastAPI should expose this endpoint:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for your frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/analytics/mercari")
async def get_mercari_analytics():
    # Return your latest analytics snapshot
    return {
        "bot_name": "mercarijp_bot",
        "bot_type": "mercari_monitor",
        "analytics": {
            # ... your analytics data
        }
    }
```

### 3. Testing

To test with mock data (without backend):

1. The API service automatically falls back to mock data if the endpoint fails
2. Open the Mercari Japan Bot modal on your site
3. Click the "Analytics" tab
4. You should see mock data displayed

To test with real data:

1. Ensure your FastAPI is running and accessible
2. Set `VITE_API_BASE_URL` in `.env.local`
3. Build and run the frontend: `npm run build && npm run preview`
4. Open the Mercari bot analytics tab

## Data Flow

```
FastAPI Bot → POST analytics every minute → FastAPI Server
                                              ↓
Frontend → GET /analytics/mercari → FastAPI Server
   ↓
BotAnalytics Component → Display in modal
```

## Displayed Metrics

### Standard Bot Metrics
- Active Servers
- Active Users (Database Size)
- Commands Today
- Total Commands
- Uptime
- Average Response Time

### Mercari-Specific Metrics
- **Listings Found**: Total listings discovered + per-minute rate
- **Notifications**: Total notifications sent + per-minute rate
- **Active Alerts**: Current active alerts + keyword count
- **API Errors**: Total API errors

### Subscription Tier Distribution
- Free tier servers
- Trial tier servers
- Basic tier servers
- Premium tier servers
- Elite tier servers

### Top Commands
Bar chart showing most-used bot commands with usage counts

## Caching

The API service implements a 5-minute cache to reduce server load:
- Repeated requests within 5 minutes use cached data
- After 5 minutes, fresh data is fetched
- If the API fails, stale cache is returned as fallback

## Troubleshooting

### Analytics not showing

1. Check browser console for errors
2. Verify `VITE_API_BASE_URL` is set correctly
3. Ensure your FastAPI endpoint is accessible
4. Check CORS configuration on backend

### Showing mock data instead of real data

1. Verify the API endpoint is reachable: `curl https://your-api.com/api/analytics/mercari`
2. Check network tab in browser DevTools
3. Ensure the response format matches the expected structure

### CORS errors

Add your frontend domain to FastAPI CORS allowed origins:

```python
allow_origins=[
    "https://your-frontend-domain.com",
    "http://localhost:5173",  # For local development
]
```

## Future Enhancements

Potential improvements to the integration:

1. Real-time updates using WebSockets
2. Historical data charts (hourly, daily, weekly)
3. Alert threshold notifications
4. Keyword performance analytics
5. Server-specific analytics breakdown

## Support

If you encounter issues with the integration:

1. Check the browser console for error messages
2. Verify your FastAPI is returning the correct data format
3. Test the endpoint directly with curl or Postman
4. Ensure CORS is properly configured
