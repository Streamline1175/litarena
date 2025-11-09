import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
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
              <HeroSection />

              <main id="bots" className="container mx-auto px-4 py-8">
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

        <footer className="mt-20 py-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; 2025 Lit Arena Bots. All rights reserved.</p>
          <p className="mt-2 text-sm">
            <a href="mailto:support@litarena.com" className="hover:text-primary-400 transition-colors">
              Support
            </a>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
