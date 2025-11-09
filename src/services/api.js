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
 * Get Mercari Japan Bot analytics
 * Expected response: Full analytics snapshot from FastAPI
 * Endpoint: POST /analytics/mercari (but we'll use GET for frontend)
 */
export async function getMercariAnalytics() {
  try {
    // Your FastAPI likely exposes a GET endpoint to fetch latest analytics
    const data = await fetchWithCache('/analytics/mercari');
    console.log('Mercari API Response:', data);

    // If API returns data with analytics already at root, normalize it
    // Your API returns: { status, error?, message?, analytics: {...} }
    if (data && data.analytics) {
      const normalized = {
        bot_name: data.bot_name || 'mercarijp_bot',
        bot_type: data.bot_type || 'mercari_monitor',
        timestamp: data.timestamp || new Date().toISOString(),
        analytics: data.analytics
      };
      console.log('Normalized Mercari data:', normalized);
      return normalized;
    }

    // If it's already in the correct format, return as-is
    console.log('Using data as-is:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch Mercari analytics:', error);
    // Return mock data structure matching your analytics system
    return {
      bot_name: 'mercarijp_bot',
      bot_type: 'mercari_monitor',
      timestamp: new Date().toISOString(),
      analytics: {
        timestamp: new Date().toISOString(),
        metrics: {
          listings_found_total: 1234,
          listings_found_last_minute: 3,
          notifications_sent_total: 567,
          notifications_sent_last_minute: 2,
          alerts_triggered_total: 89,
          alerts_triggered_last_minute: 0,
          api_requests_total: 5432,
          api_requests_last_minute: 12,
          api_errors_total: 23,
          api_errors_last_minute: 0,
          avg_api_response_time_ms: 87,
          last_api_response_time_ms: 85,
          active_servers: 15,
          active_keywords: 45,
          active_alerts: 23,
          database_size: 8934,
          bot_uptime_seconds: 345678,
          free_tier_servers: 8,
          trial_tier_servers: 2,
          basic_tier_servers: 3,
          premium_tier_servers: 1,
          elite_tier_servers: 1,
          commands_executed_total: 2345,
          commands_executed_last_minute: 1,
        },
        charts: {
          listings_per_minute: Array(60).fill(0).map(() => Math.floor(Math.random() * 5)),
          api_requests_per_minute: Array(60).fill(0).map(() => Math.floor(Math.random() * 15) + 5),
          notifications_per_minute: Array(60).fill(0).map(() => Math.floor(Math.random() * 3)),
        },
        top_keywords_searches: [
          { keyword: 'pokemon', count: 150 },
          { keyword: 'nintendo', count: 89 },
          { keyword: 'sony', count: 67 },
        ],
        top_keywords_listings: [
          { keyword: 'pokemon', count: 450 },
          { keyword: 'nintendo', count: 234 },
          { keyword: 'sony', count: 189 },
        ],
        top_commands: [
          { command: 'createalert', count: 45 },
          { command: 'status', count: 38 },
          { command: 'help', count: 32 },
        ],
        recent_listings: [],
        recent_events: [],
        recent_errors: [],
        price_stats: {},
        uptime_formatted: '2d 14h 23m',
      },
    };
  }
}

/**
 * Get bot-specific stats (override for Mercari to use its specific endpoint)
 */
export async function getBotStatsEnhanced(botId) {
  // For Mercari bot, use the specialized analytics endpoint
  if (botId === 'mercari-japan-bot') {
    try {
      const mercariData = await getMercariAnalytics();
      // Transform Mercari analytics to match generic bot stats format
      return {
        servers: mercariData.analytics.metrics.active_servers || 0,
        users: mercariData.analytics.metrics.database_size || 0,
        commandsToday: mercariData.analytics.metrics.commands_executed_last_minute * 60 * 24 || 0,
        commandsTotal: mercariData.analytics.metrics.commands_executed_total || 0,
        uptime: 99.5,
        averageResponseTime: mercariData.analytics.metrics.avg_api_response_time_ms || 0,
        topCommands: mercariData.analytics.top_commands || [],
        // Add Mercari-specific metrics
        mercariSpecific: {
          listingsTotal: mercariData.analytics.metrics.listings_found_total,
          listingsLastMinute: mercariData.analytics.metrics.listings_found_last_minute,
          notificationsTotal: mercariData.analytics.metrics.notifications_sent_total,
          notificationsLastMinute: mercariData.analytics.metrics.notifications_sent_last_minute,
          alertsTotal: mercariData.analytics.metrics.alerts_triggered_total,
          activeKeywords: mercariData.analytics.metrics.active_keywords,
          activeAlerts: mercariData.analytics.metrics.active_alerts,
          apiErrors: mercariData.analytics.metrics.api_errors_total,
          tierDistribution: {
            free: mercariData.analytics.metrics.free_tier_servers,
            trial: mercariData.analytics.metrics.trial_tier_servers,
            basic: mercariData.analytics.metrics.basic_tier_servers,
            premium: mercariData.analytics.metrics.premium_tier_servers,
            elite: mercariData.analytics.metrics.elite_tier_servers,
          },
        },
      };
    } catch (error) {
      console.error('Failed to fetch Mercari-specific stats:', error);
      // Fall back to generic stats
      return await getBotStats(botId);
    }
  }

  // For other bots, use generic endpoint
  return await getBotStats(botId);
}

/**
 * Get bot analytics (override for Mercari to use its charts data)
 */
export async function getBotAnalyticsEnhanced(botId, timeRange = '7d') {
  // For Mercari bot, use the specialized analytics endpoint
  if (botId === 'mercari-japan-bot') {
    try {
      const mercariData = await getMercariAnalytics();

      // Create labels for last 60 minutes
      const labels = Array.from({ length: 60 }, (_, i) => {
        const minutesAgo = 59 - i;
        return `${minutesAgo}m ago`;
      });

      return {
        labels,
        datasets: [
          {
            label: 'Listings Found',
            data: mercariData.analytics.charts.listings_per_minute || [],
            color: '#0ea5e9', // sky-500
          },
          {
            label: 'Notifications Sent',
            data: mercariData.analytics.charts.notifications_per_minute || [],
            color: '#ec4899', // pink-500
          },
          {
            label: 'API Requests',
            data: mercariData.analytics.charts.api_requests_per_minute || [],
            color: '#8b5cf6', // violet-500
          },
        ],
      };
    } catch (error) {
      console.error('Failed to fetch Mercari-specific analytics:', error);
      // Fall back to generic analytics
      return await getBotAnalytics(botId, timeRange);
    }
  }

  // For other bots, use generic endpoint
  return await getBotAnalytics(botId, timeRange);
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
  getBotStatsEnhanced,
  getBotAnalytics,
  getBotAnalyticsEnhanced,
  getReviews,
  getTrendingBots,
  getMercariAnalytics,
  clearCache,
};
