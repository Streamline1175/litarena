import { motion } from 'framer-motion';
import { Moon, Sun, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

function Header({ darkMode, setDarkMode }) {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-effect sticky top-0 z-50 border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl"
            >
              <Bot className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Lit Arena Bots
              </h1>
              <p className="text-sm text-gray-400">
                Professional Discord Bots for Every Need
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 glass-effect glass-hover rounded-xl"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
            </motion.button>

            <Link to="/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all"
              >
                Admin Panel
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
