import { motion } from 'framer-motion';

const FilterBar = ({ statusFilter, setStatusFilter, category = 'bots' }) => {
  const botFilters = [
    { id: 'all', label: 'All Bots', color: 'primary' },
    { id: 'active', label: 'Active', color: 'green' },
    { id: 'beta', label: 'Beta', color: 'yellow' },
    { id: 'maintenance', label: 'Maintenance', color: 'red' }
  ];

  const toolFilters = [
    { id: 'all', label: 'All Tools', color: 'primary' },
    { id: 'active', label: 'Available', color: 'green' },
    { id: 'coming-soon', label: 'Coming Soon', color: 'blue' },
    { id: 'beta', label: 'Beta', color: 'yellow' }
  ];

  const filters = category === 'bots' ? botFilters : toolFilters;

  const getColorClasses = (color, isActive) => {
    const colors = {
      primary: {
        active: 'bg-primary-500/20 border-primary-400/50 text-primary-300 shadow-primary-500/30',
        inactive: 'bg-white/5 border-white/10 text-gray-400 hover:bg-primary-500/10 hover:border-primary-500/30'
      },
      green: {
        active: 'bg-green-500/20 border-green-400/50 text-green-300 shadow-green-500/30',
        inactive: 'bg-white/5 border-white/10 text-gray-400 hover:bg-green-500/10 hover:border-green-500/30'
      },
      blue: {
        active: 'bg-blue-500/20 border-blue-400/50 text-blue-300 shadow-blue-500/30',
        inactive: 'bg-white/5 border-white/10 text-gray-400 hover:bg-blue-500/10 hover:border-blue-500/30'
      },
      yellow: {
        active: 'bg-yellow-500/20 border-yellow-400/50 text-yellow-300 shadow-yellow-500/30',
        inactive: 'bg-white/5 border-white/10 text-gray-400 hover:bg-yellow-500/10 hover:border-yellow-500/30'
      },
      red: {
        active: 'bg-red-500/20 border-red-400/50 text-red-300 shadow-red-500/30',
        inactive: 'bg-white/5 border-white/10 text-gray-400 hover:bg-red-500/10 hover:border-red-500/30'
      }
    };

    return isActive ? colors[color].active : colors[color].inactive;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-wrap gap-4 justify-center items-center mt-8 mb-4"
    >
      {filters.map((filter, index) => {
        const isActive = statusFilter === filter.id;

        return (
          <motion.button
            key={filter.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStatusFilter(filter.id)}
            className={`
              px-6 py-3 rounded-xl border backdrop-blur-lg
              font-medium text-sm transition-all duration-300
              shadow-lg min-w-[120px]
              ${getColorClasses(filter.color, isActive)}
              ${isActive ? 'ring-2 ring-offset-2 ring-offset-transparent' : ''}
            `}
          >
            <span className="relative z-10">{filter.label}</span>

            {/* Glow effect for active filter */}
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 blur-md -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default FilterBar;
