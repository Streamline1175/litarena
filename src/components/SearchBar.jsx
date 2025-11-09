import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery, placeholder = "Search bots..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-2xl mx-auto"
    >
      <div className="relative">
        <motion.div
          whileFocus={{ scale: 1.02 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5 pointer-events-none z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl
                     text-white placeholder-gray-400 outline-none
                     focus:bg-white/15 focus:border-primary-400/50 focus:ring-2 focus:ring-primary-400/30
                     transition-all duration-300 ease-in-out
                     shadow-lg shadow-black/10 hover:shadow-primary-500/20"
          />
        </motion.div>

        {/* Animated gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 opacity-0 hover:opacity-20 transition-opacity duration-300 -z-10 blur-xl pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default SearchBar;
