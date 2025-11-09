import { motion } from 'framer-motion';
import BotCard from './BotCard';

const BotGrid = ({ bots, onBotClick, searchTerm, activeFilter }) => {
  // Filter bots based on search term and active filter
  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || bot.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // No results state
  if (filteredBots.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 px-4"
      >
        <div className="text-6xl mb-4">🤖</div>
        <h3 className="text-2xl font-bold text-white mb-2">No bots found</h3>
        <p className="text-gray-400 text-center max-w-md">
          Try adjusting your search terms or filters to find what you're looking for.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
    >
      {filteredBots.map((bot, index) => (
        <BotCard
          key={bot.id}
          bot={bot}
          onClick={() => onBotClick(bot)}
          index={index}
        />
      ))}
    </motion.div>
  );
};

export default BotGrid;
