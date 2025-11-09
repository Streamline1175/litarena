import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Bot, Users, Server, Zap } from 'lucide-react';
import { getGlobalStats } from '../services/api';

const HeroSection = () => {
  const [stats, setStats] = useState({
    totalServers: 0,
    totalUsers: 0,
    totalCommands: 0,
    uptime: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getGlobalStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const statItems = [
    {
      icon: Server,
      label: 'Active Servers',
      value: stats.totalServers,
      suffix: '+',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      label: 'Happy Users',
      value: stats.totalUsers,
      suffix: '+',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      label: 'Commands Executed',
      value: stats.totalCommands,
      suffix: '+',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Bot,
      label: 'Uptime',
      value: stats.uptime,
      suffix: '%',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  // Animated counter component
  const AnimatedCounter = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (isLoading) return;

      let startTime;
      const animateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration;

        if (progress < 1) {
          setCount(Math.floor(value * progress));
          requestAnimationFrame(animateCount);
        } else {
          setCount(value);
        }
      };

      requestAnimationFrame(animateCount);
    }, [value, duration, isLoading]);

    return <>{count.toLocaleString()}</>;
  };

  return (
    <div className="relative overflow-hidden py-20 mb-12">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-primary-500/10 animate-gradient-shift" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-400/30 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              y: [null, Math.random() * 100 + '%'],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative container mx-auto px-4">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 blur-3xl opacity-50 animate-pulse" />
              <Bot className="relative w-20 h-20 text-primary-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="gradient-text">Lit Arena Bots</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto"
          >
            Professional Discord bots that power communities, automate workflows, and enhance user experiences
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            From card trading to community management, our suite of specialized bots delivers enterprise-grade features with a focus on reliability and innovation.
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="glass-effect p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                {/* Gradient glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity rounded-2xl`} />

                <div className="relative">
                  <stat.icon className={`w-8 h-8 mb-3 bg-gradient-to-br ${stat.color} text-transparent bg-clip-text`} strokeWidth={2.5} />

                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {isLoading ? (
                      <div className="h-10 bg-white/10 rounded animate-pulse" />
                    ) : (
                      <>
                        <AnimatedCounter value={stat.value} />
                        {stat.suffix}
                      </>
                    )}
                  </div>

                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          <motion.a
            href="#bots"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl font-semibold text-white
                     hover:shadow-lg hover:shadow-primary-500/50 transition-all flex items-center gap-2"
          >
            <Bot className="w-5 h-5" />
            Explore Bots
          </motion.a>

          <motion.a
            href="https://discord.gg/your-server"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl font-semibold text-white
                     hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            Join Community
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
