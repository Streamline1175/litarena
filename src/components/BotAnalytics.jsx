import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TrendingUp, Server, Clock, Zap, Bell, Search, AlertCircle, Database, Activity } from 'lucide-react';
import { getBotStatsEnhanced } from '../services/api';

const BotAnalytics = ({ botId }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMercariBot = botId === 'mercari-japan-bot';

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      try {
        const data = await getBotStatsEnhanced(botId);
        setStats(data);
      } catch (error) {
        console.error('Failed to load bot stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, [botId]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-effect p-4 rounded-xl animate-pulse">
            <div className="h-4 bg-white/10 rounded mb-2" />
            <div className="h-8 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-400">
        Analytics unavailable at this time
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mercari-Specific Stats */}
      {isMercariBot && stats.mercariSpecific && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-400" />
            Mercari Monitoring Activity
          </h4>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="glass-effect p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Listings Found</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.mercariSpecific.listingsTotal?.toLocaleString()}</div>
              <div className="text-xs text-blue-400 mt-1">+{stats.mercariSpecific.listingsLastMinute}/min</div>
            </div>

            <div className="glass-effect p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-pink-400" />
                <span className="text-xs text-gray-400">Notifications</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.mercariSpecific.notificationsTotal?.toLocaleString()}</div>
              <div className="text-xs text-pink-400 mt-1">+{stats.mercariSpecific.notificationsLastMinute}/min</div>
            </div>

            <div className="glass-effect p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">API Requests</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.mercariSpecific.apiRequestsTotal?.toLocaleString()}</div>
              <div className="text-xs text-purple-400 mt-1">+{stats.mercariSpecific.apiRequestsLastMinute}/min</div>
            </div>

            <div className="glass-effect p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400">Alerts Triggered</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.mercariSpecific.alertsTotal?.toLocaleString()}</div>
              <div className="text-xs text-yellow-400 mt-1">+{stats.mercariSpecific.alertsLastMinute}/min</div>
            </div>
          </div>

          {/* Monitoring Status */}
          <div className="glass-effect p-4 rounded-xl border border-white/10">
            <h5 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              Active Monitoring
            </h5>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{stats.mercariSpecific.activeKeywords}</div>
                <div className="text-xs text-gray-400 mt-1">Active Keywords</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.mercariSpecific.activeAlerts}</div>
                <div className="text-xs text-gray-400 mt-1">Active Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{stats.mercariSpecific.databaseSize?.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">Database Entries</div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-effect p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-gray-400">Bot Uptime</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.mercariSpecific.uptimeFormatted || '0s'}</div>
              <div className="text-xs text-gray-400 mt-1">{stats.mercariSpecific.uptimeSeconds?.toLocaleString()} seconds</div>
            </div>

            <div className="glass-effect p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-red-400" />
                <span className="text-xs text-gray-400">API Errors</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.mercariSpecific.apiErrors}</div>
              <div className="text-xs text-gray-400 mt-1">+{stats.mercariSpecific.apiErrorsLastMinute} last minute</div>
            </div>
          </div>

          {/* Tier Distribution */}
          {stats.mercariSpecific.tierDistribution && (
            <div className="glass-effect p-5 rounded-xl border border-white/10">
              <h5 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Server className="w-4 h-4 text-primary-400" />
                Subscription Tier Distribution
              </h5>
              <div className="grid grid-cols-6 gap-3">
                {Object.entries(stats.mercariSpecific.tierDistribution).map(([tier, count]) => {
                  const tierConfig = {
                    trial: { color: 'text-gray-400', label: 'Trial' },
                    tier_1: { color: 'text-blue-400', label: 'Tier 1' },
                    tier_2: { color: 'text-green-400', label: 'Tier 2' },
                    tier_3: { color: 'text-purple-400', label: 'Tier 3' },
                    tier_4: { color: 'text-yellow-400', label: 'Tier 4' },
                    tier_5: { color: 'text-pink-400', label: 'Tier 5' },
                  };
                  const config = tierConfig[tier] || { color: 'text-primary-400', label: tier };
                  return (
                    <div key={tier} className="text-center p-3 rounded-lg bg-white/5">
                      <div className={`text-3xl font-bold ${config.color}`}>{count}</div>
                      <div className="text-xs text-gray-400 mt-1">{config.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Top Commands */}
      {stats.topCommands && stats.topCommands.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isMercariBot ? 0.4 : 0.3 }}
          className="glass-effect p-6 rounded-xl border border-white/10"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            Most Used Commands
          </h4>
          <div className="space-y-3">
            {stats.topCommands.map((command, index) => {
              const maxCount = stats.topCommands[0]?.count || 1;
              const percentage = (command.count / maxCount) * 100;

              return (
                <div key={command.name || command.command} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 font-mono">/{command.name || command.command}</span>
                    <span className="text-gray-400">{command.count.toLocaleString()} uses</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: (isMercariBot ? 0.5 : 0.4) + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default BotAnalytics;
