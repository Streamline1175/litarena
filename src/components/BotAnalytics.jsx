import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { TrendingUp, Users, Server, Clock, Zap } from 'lucide-react';
import { getBotStats } from '../services/api';

const BotAnalytics = ({ botId }) => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      try {
        const data = await getBotStats(botId);
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

  const statCards = [
    {
      icon: Server,
      label: 'Servers',
      value: stats.servers?.toLocaleString() || '0',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      label: 'Active Users',
      value: stats.users?.toLocaleString() || '0',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      label: 'Commands Today',
      value: stats.commandsToday?.toLocaleString() || '0',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: TrendingUp,
      label: 'Total Commands',
      value: stats.commandsTotal?.toLocaleString() || '0',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      label: 'Uptime',
      value: `${stats.uptime?.toFixed(2) || '0'}%`,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Zap,
      label: 'Avg Response',
      value: `${stats.averageResponseTime || '0'}ms`,
      color: 'from-red-500 to-pink-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-effect p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-5 h-5 bg-gradient-to-br ${stat.color} text-transparent bg-clip-text`} />
              </div>
              <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Top Commands */}
      {stats.topCommands && stats.topCommands.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
                <div key={command.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 font-mono">/{command.name}</span>
                    <span className="text-gray-400">{command.count.toLocaleString()} uses</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Performance Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-effect p-6 rounded-xl border border-white/10 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 mb-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-300 font-semibold text-sm">Operational</span>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {stats.uptime >= 99 ? 'Excellent' : stats.uptime >= 95 ? 'Good' : 'Fair'} uptime performance
        </p>
      </motion.div>
    </div>
  );
};

export default BotAnalytics;
