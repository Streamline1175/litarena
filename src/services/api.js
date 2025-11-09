/**
 * API Service for Lit Arena Bots
 * Configure your API base URL in the environment or here
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-api-domain.com/api';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

/**
 * Generic fetch with caching
 */
async function fetchWithCache(endpoint, options = {}) {
  const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    // Return cached data if available, even if stale
    if (cached) {
      return cached.data;
    }
    throw error;
  }
}

/**
 * Get global statistics across all bots
 * Expected response: { totalServers, totalUsers, totalCommands, uptime }
 */
export async function getGlobalStats() {
  try {
    return await fetchWithCache('/stats/global');
  } catch (error) {
    // Return mock data for development/fallback
    return {
      totalServers: 1250,
      totalUsers: 45680,
      totalCommands: 892340,
      uptime: 99.8,
    };
  }
}

/**
 * Get statistics for a specific bot
 * Expected response: {
 *   servers, users, commandsToday, commandsTotal,
 *   uptime, averageResponseTime, topCommands
 * }
 */
export async function getBotStats(botId) {
  try {
    return await fetchWithCache(`/stats/bot/${botId}`);
  } catch (error) {
    // Return mock data for development
    return {
      servers: Math.floor(Math.random() * 500) + 50,
      users: Math.floor(Math.random() * 10000) + 1000,
      commandsToday: Math.floor(Math.random() * 5000) + 100,
      commandsTotal: Math.floor(Math.random() * 100000) + 10000,
      uptime: 99.5 + Math.random() * 0.5,
      averageResponseTime: Math.floor(Math.random() * 100) + 50,
      topCommands: [
        { name: 'help', count: Math.floor(Math.random() * 1000) },
        { name: 'search', count: Math.floor(Math.random() * 800) },
        { name: 'info', count: Math.floor(Math.random() * 600) },
      ],
    };
  }
}

/**
 * Get usage analytics over time
 * Expected response: { labels: [...], datasets: [...] }
 */
export async function getBotAnalytics(botId, timeRange = '7d') {
  try {
    return await fetchWithCache(`/analytics/bot/${botId}?range=${timeRange}`);
  } catch (error) {
    // Return mock chart data
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 7;
    const labels = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Commands',
          data: Array.from({ length: days }, () => Math.floor(Math.random() * 500) + 100),
        },
        {
          label: 'Active Users',
          data: Array.from({ length: days }, () => Math.floor(Math.random() * 200) + 50),
        },
      ],
    };
  }
}

/**
 * Get user reviews/testimonials
 * Expected response: [{ user, avatar, rating, comment, date }]
 */
export async function getReviews(botId = null) {
  try {
    const endpoint = botId ? `/reviews/bot/${botId}` : '/reviews';
    return await fetchWithCache(endpoint);
  } catch (error) {
    // Return mock reviews
    return [
      {
        user: 'CardCollector#1234',
        avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
        rating: 5,
        comment: 'Amazing bot! Helped me find undervalued cards and made great profits.',
        date: '2025-01-15',
        botName: 'Card Flipper Bot',
      },
      {
        user: 'TradingPro#5678',
        avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
        rating: 5,
        comment: 'The best TCG price tracking bot out there. Highly recommend!',
        date: '2025-01-14',
        botName: 'TCGPlayer Bot',
      },
      {
        user: 'ServerAdmin#9012',
        avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
        rating: 4,
        comment: 'Great automation features. Saves me hours of manual work.',
        date: '2025-01-13',
        botName: 'Auto Pinger Bot',
      },
    ];
  }
}

/**
 * Get trending/popular bots
 */
export async function getTrendingBots() {
  try {
    return await fetchWithCache('/bots/trending');
  } catch (error) {
    return [];
  }
}

/**
 * Clear API cache (useful for admin actions)
 */
export function clearCache() {
  cache.clear();
}

export default {
  getGlobalStats,
  getBotStats,
  getBotAnalytics,
  getReviews,
  getTrendingBots,
  clearCache,
};
