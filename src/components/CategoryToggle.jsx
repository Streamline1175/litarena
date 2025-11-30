import { motion } from 'framer-motion';
import { Bot, Monitor } from 'lucide-react';

const CategoryToggle = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    { 
      id: 'bots', 
      label: 'Discord Bots', 
      icon: Bot,
      description: 'Powerful automation for Discord'
    },
    { 
      id: 'tools', 
      label: 'Desktop Tools', 
      icon: Monitor,
      description: 'Clean utilities for your PC'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center mb-8"
    >
      <div className="relative inline-flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 overflow-hidden">
        {/* Animated background slider */}
        <motion.div
          className="absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-primary-500/30 to-accent-500/30 border border-primary-400/30"
          initial={false}
          animate={{
            left: activeCategory === 'bots' ? '6px' : '50%',
          }}
          style={{ width: 'calc(50% - 6px)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />

        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative z-10 flex items-center gap-3 px-6 py-4 rounded-xl
                transition-all duration-300 min-w-[200px]
                ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}
              `}
            >
              <Icon 
                className={`w-5 h-5 transition-colors duration-300 ${
                  isActive ? 'text-primary-400' : 'text-gray-500'
                }`} 
              />
              <div className="text-left">
                <div className="font-semibold text-sm">{category.label}</div>
                <div className={`text-[10px] transition-colors duration-300 ${
                  isActive ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {category.description}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CategoryToggle;
