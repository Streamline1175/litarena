import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TestimonialsSection from './components/TestimonialsSection';
import BotGrid from './components/BotGrid';
import BotModal from './components/BotModal';
import AdminPanel from './components/AdminPanel';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import botsData from './data/bots.json';

function App() {
  const [bots, setBots] = useState(() => {
    // Try to load from localStorage first
    const savedBots = localStorage.getItem('bots');
    return savedBots ? JSON.parse(savedBots) : botsData;
  });

  const [selectedBot, setSelectedBot] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(true);

  // Save bots to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bots', JSON.stringify(bots));
  }, [bots]);

  // Filter bots based on search and status
  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bot.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || bot.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateBots = (newBots) => {
    setBots(newBots);
  };

  return (
    <Router basename="/litarena">
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <Routes>
          <Route path="/admin" element={
            <AdminPanel bots={bots} updateBots={updateBots} />
          } />

          <Route path="/" element={
            <>
              <main id="bots" className="container mx-auto px-4 py-8 mt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />

                  <FilterBar
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                  />

                  <div className="mt-6 mb-4 text-gray-400 text-sm">
                    Showing {filteredBots.length} of {bots.length} bots
                  </div>

                  <BotGrid
                    bots={filteredBots}
                    onBotClick={setSelectedBot}
                  />
                </motion.div>
              </main>

              <TestimonialsSection />
            </>
          } />
        </Routes>

        <AnimatePresence>
          {selectedBot && (
            <BotModal
              bot={selectedBot}
              onClose={() => setSelectedBot(null)}
            />
          )}
        </AnimatePresence>

        <footer className="mt-20 py-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4">
            {/* Privacy Notice */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
              <h3 className="text-white font-semibold text-lg mb-3">Privacy & Data Collection</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                None of our bots collect, store, or process any personal user data. All bot interactions are handled through third-party platforms (Discord, Mercari, etc.) and we do not have access to or retain any user information beyond what is necessary for the bot's immediate functionality.
              </p>
            </div>

            {/* Copyright and Contact */}
            <div className="text-center text-gray-400">
              <p className="text-sm">&copy; 2025 Lit Arena Bots. All rights reserved.</p>
              <p className="mt-3 text-sm">
                <a
                  href="https://discord.com/users/100304188658958336"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-400 transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Contact on Discord
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
