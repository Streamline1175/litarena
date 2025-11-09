# Lit Arena Bots - API Integration Guide

This document explains how to integrate your backend API with the bot showcase frontend.

## Overview

The frontend includes API integration for real-time analytics, statistics, and user reviews. The API service is located in `src/services/api.js` and includes built-in caching to reduce server load.

## Configuration

1. Copy `.env.example` to `.env.local`
2. Update `VITE_API_BASE_URL` with your API endpoint

```bash
cp .env.example .env.local
# Edit .env.local with your API URL
```

## Required API Endpoints

### 1. Global Statistics
**GET** `/stats/global`

Returns aggregate statistics across all bots.

**Response:**
```json
{
  "totalServers": 1250,
  "totalUsers": 45680,
  "totalCommands": 892340,
  "uptime": 99.8
}
```

### 2. Bot-Specific Statistics
**GET** `/stats/bot/:botId`

Returns statistics for a specific bot.

**Response:**
```json
{
  "servers": 234,
  "users": 5680,
  "commandsToday": 1234,
  "commandsTotal": 45670,
  "uptime": 99.5,
  "averageResponseTime": 87,
  "topCommands": [
    { "name": "help", "count": 567 },
    { "name": "search", "count": 432 },
    { "name": "info", "count": 321 }
  ]
}
```

### 3. Bot Analytics
**GET** `/analytics/bot/:botId?range={7d|30d}`

Returns time-series data for charts.

**Response:**
```json
{
  "labels": ["Jan 1", "Jan 2", "Jan 3", ...],
  "datasets": [
    {
      "label": "Commands",
      "data": [245, 312, 189, ...]
    },
    {
      "label": "Active Users",
      "data": [78, 95, 62, ...]
    }
  ]
}
```

### 4. Reviews/Testimonials
**GET** `/reviews` (all reviews)
**GET** `/reviews/bot/:botId` (bot-specific)

**Response:**
```json
[
  {
    "user": "Username#1234",
    "avatar": "https://cdn.discordapp.com/avatars/...",
    "rating": 5,
    "comment": "Amazing bot! ...",
    "date": "2025-01-15",
    "botName": "Card Flipper Bot"
  }
]
```

### 5. Trending Bots
**GET** `/bots/trending`

Returns array of bot IDs sorted by popularity.

**Response:**
```json
["card-flipper-bot", "tcgplayer-bot", "auto-pinger-bot"]
```

## Fallback Behavior

If API endpoints are unavailable, the frontend will:
1. Use cached data if available
2. Fall back to mock/demo data for development
3. Display gracefully degraded UI (e.g., hide analytics if unavailable)

## Caching

- Default cache duration: 5 minutes
- Cache persists in memory during session
- Call `clearCache()` to manually invalidate

```javascript
import { clearCache } from './services/api';

// Clear cache after admin updates
clearCache();
```

## Example Backend Implementation

### Node.js/Express Example

```javascript
const express = require('express');
const router = express.Router();

// Global stats
router.get('/stats/global', async (req, res) => {
  const stats = await getGlobalStatsFromDatabase();
  res.json(stats);
});

// Bot stats
router.get('/stats/bot/:botId', async (req, res) => {
  const { botId } = req.params;
  const stats = await getBotStatsFromDatabase(botId);
  res.json(stats);
});

// Reviews
router.get('/reviews', async (req, res) => {
  const reviews = await getReviewsFromDatabase();
  res.json(reviews);
});

module.exports = router;
```

## CORS Configuration

Ensure your API allows requests from your GitHub Pages domain:

```javascript
// Express CORS example
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://streamline1175.github.io'
  ],
  credentials: true
}));
```

## Data Collection Tips

### Bot Statistics
- Track Discord events (guild add/remove for server count)
- Log command executions
- Monitor bot uptime and response times
- Store data in time-series database (InfluxDB, TimescaleDB)

### User Reviews
- Implement review submission endpoint (POST)
- Add moderation queue for new reviews
- Include star rating (1-5)
- Associate reviews with bot IDs

### Analytics
- Use aggregation queries for time-series data
- Pre-compute daily/hourly rollups
- Cache expensive queries
- Consider using Redis for real-time counters

## Security Considerations

1. **Rate Limiting**: Implement rate limiting on API endpoints
2. **Authentication**: Optional - add API keys for write operations
3. **Validation**: Validate all bot IDs and parameters
4. **HTTPS**: Always use HTTPS in production
5. **Sanitization**: Sanitize user-generated content (reviews)

## Testing

Test API endpoints with mock data:

```bash
# Test global stats
curl https://your-api.com/api/stats/global

# Test bot stats
curl https://your-api.com/api/stats/bot/card-flipper-bot

# Test reviews
curl https://your-api.com/api/reviews
```

## Next Steps

1. Set up your backend API server
2. Configure database for bot statistics
3. Implement the required endpoints
4. Update `.env.local` with your API URL
5. Test integration locally
6. Deploy both frontend and backend

## Support

For questions about API integration, refer to:
- `src/services/api.js` - Frontend API client
- This document
- Create an issue in the repository
