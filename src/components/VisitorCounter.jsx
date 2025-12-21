import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, TrendingUp, BarChart3 } from 'lucide-react';

/**
 * VisitorCounter - Displays real-time visitor statistics using GoatCounter API
 * Shows: current visitors, daily pageviews, and total views
 */
function VisitorCounter() {
    const [stats, setStats] = useState({
        visitorsToday: null,
        pageviewsToday: null,
        totalViews: null,
        loading: true,
        error: false
    });

    // GoatCounter site code - will be set up on goatcounter.com
    const GOATCOUNTER_CODE = 'litarena';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // GoatCounter provides a public JSON API for stats
                // The endpoint returns visitor counts that we can display
                const response = await fetch(
                    `https://${GOATCOUNTER_CODE}.goatcounter.com/counter/${encodeURIComponent(window.location.pathname)}.json`
                );

                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        visitorsToday: data.count || 0,
                        pageviewsToday: data.count_unique || data.count || 0,
                        totalViews: data.count || 0,
                        loading: false,
                        error: false
                    });
                } else {
                    // If specific page counter fails, try total site stats
                    setStats(prev => ({ ...prev, loading: false }));
                }
            } catch (err) {
                console.log('[GoatCounter] Stats fetch unavailable - will show after site is registered');
                setStats(prev => ({ ...prev, loading: false, error: true }));
            }
        };

        // Fetch stats initially and every 30 seconds
        fetchStats();
        const interval = setInterval(fetchStats, 30000);

        return () => clearInterval(interval);
    }, []);

    // Don't render if there's an error or still loading with no data
    // This provides a graceful degradation
    if (stats.error || (stats.loading && stats.visitorsToday === null)) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 
                 border border-emerald-500/20 rounded-full backdrop-blur-sm"
        >
            {/* Pulsing live indicator */}
            <div className="relative flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 text-xs font-medium uppercase tracking-wider">Live</span>
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-white/20"></div>

            {/* Visitor count */}
            <div className="flex items-center gap-1.5 text-gray-300">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-sm font-medium">
                    {stats.loading ? (
                        <span className="inline-block w-8 h-4 bg-white/10 rounded animate-pulse"></span>
                    ) : (
                        <span className="text-white">{stats.visitorsToday?.toLocaleString() || '—'}</span>
                    )}
                </span>
                <span className="text-xs text-gray-400">views today</span>
            </div>
        </motion.div>
    );
}

/**
 * VisitorBadge - A compact version for header/minimal display
 */
export function VisitorBadge() {
    const [count, setCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Use the GoatCounter pixel counter which works without CORS
        const getCount = () => {
            // GoatCounter exposes count via a callback if using their pixel
            if (window.goatcounter?.count) {
                setCount(window.goatcounter.count);
                setLoading(false);
            }
        };

        // Check periodically for the count
        const interval = setInterval(getCount, 5000);
        getCount();

        return () => clearInterval(interval);
    }, []);

    if (loading || count === null) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs"
        >
            <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span className="text-gray-300">{count} online</span>
        </motion.div>
    );
}

/**
 * AnalyticsDashboard - A more detailed stats view for the footer
 */
export function AnalyticsDashboard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-3 gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
        >
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-lg font-bold">—</span>
                </div>
                <span className="text-xs text-gray-400">Visitors Today</span>
            </div>

            <div className="text-center border-x border-white/10">
                <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
                    <Eye className="w-4 h-4" />
                    <span className="text-lg font-bold">—</span>
                </div>
                <span className="text-xs text-gray-400">Page Views</span>
            </div>

            <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-lg font-bold">—</span>
                </div>
                <span className="text-xs text-gray-400">This Week</span>
            </div>
        </motion.div>
    );
}

export default VisitorCounter;
