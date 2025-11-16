import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Header({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [keySequence, setKeySequence] = useState([]);

  // Secret key combo to access admin: Ctrl+Shift+A
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        // Navigate to admin (password check happens there)
        navigate('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

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
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="/litarena/logo.png"
                alt="Lit Arena Logo"
                className="w-16 h-16 rounded-xl"
              />
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

            {/* Admin panel button removed - Access via Ctrl+Shift+A */}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
