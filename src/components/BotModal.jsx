import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const BotModal = ({ bot, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedChangelog, setExpandedChangelog] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);

  if (!bot) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'media', label: 'Screenshots & Videos' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'changelog', label: 'Changelog' }
  ];

  const statusColors = {
    active: 'bg-green-500/20 text-green-300 border-green-400/50',
    beta: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
    maintenance: 'bg-red-500/20 text-red-300 border-red-400/50',
    deprecated: 'bg-gray-500/20 text-gray-300 border-gray-400/50'
  };

  const toggleChangelog = (index) => {
    setExpandedChangelog(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // Backdrop click handler
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-slate-900/95 to-slate-800/95
                       backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-lg border-b border-white/10 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 ring-2 ring-white/20">
                      <img
                        src={bot.icon}
                        alt={`${bot.name} icon`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-4xl">🤖</div>';
                        }}
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{bot.name}</h2>
                      <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium border ${statusColors[bot.status]}`}>
                        {bot.status}
                      </span>
                    </div>
                  </div>

                  {/* Close button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300
                        ${activeTab === tab.id
                          ? 'bg-primary-500/20 text-primary-300 border border-primary-400/50'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-transparent'
                        }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-400"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
                        <p className="text-gray-300 leading-relaxed">{bot.description}</p>
                      </div>

                      {bot.details && (
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-3">Details</h3>
                          <p className="text-gray-300 leading-relaxed">{bot.details}</p>
                        </div>
                      )}

                      {bot.links && (
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-3">Links</h3>
                          <div className="flex flex-wrap gap-3">
                            {bot.links.map((link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20
                                         text-primary-300 rounded-lg border border-primary-400/30 transition-all duration-300
                                         hover:scale-105"
                              >
                                {link.label}
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Features Tab */}
                  {activeTab === 'features' && (
                    <motion.div
                      key="features"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {bot.features?.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10
                                     hover:bg-white/10 transition-all duration-300"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Pricing Tab */}
                  {activeTab === 'pricing' && (
                    <motion.div
                      key="pricing"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="text-center">
                        <h3 className="text-3xl font-bold text-white mb-3">Choose Your Plan</h3>
                        {bot.pricing && bot.pricing.model && (
                          <p className="text-gray-400 text-lg">
                            <span className="capitalize font-semibold text-primary-400">{bot.pricing.model}</span> pricing model
                          </p>
                        )}
                      </div>

                      {bot.pricing && bot.pricing.tiers && bot.pricing.tiers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                          {bot.pricing.tiers.map((tier, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 ${
                                tier.popular
                                  ? 'shadow-2xl shadow-primary-500/30'
                                  : 'shadow-xl'
                              }`}
                            >
                              {/* Background gradient for popular tier */}
                              {tier.popular && (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-accent-600/20 to-primary-600/20 opacity-50" />
                              )}

                              {/* Card content */}
                              <div className={`relative flex flex-col h-full p-5 ${
                                tier.popular
                                  ? 'bg-gradient-to-br from-slate-800/95 to-slate-900/95 border-2 border-primary-500/50'
                                  : 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/10'
                              }`}>

                                {/* Popular badge */}
                                {tier.popular && (
                                  <div className="flex justify-center mb-3">
                                    <div className="px-4 py-1.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold rounded-full shadow-lg">
                                      ⭐ MOST POPULAR
                                    </div>
                                  </div>
                                )}

                                {/* Tier header */}
                                <div className="text-center mb-5">
                                  <h4 className="text-xl font-bold text-white mb-3">{tier.name}</h4>
                                  <div className="mb-1">
                                    <span className="text-4xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                      {tier.price}
                                    </span>
                                  </div>
                                  {tier.period && tier.period !== 'forever' && (
                                    <p className="text-gray-400 text-xs font-medium">
                                      per {tier.period}
                                    </p>
                                  )}
                                  {tier.period === 'forever' && (
                                    <p className="text-green-400 text-xs font-semibold">
                                      Forever free
                                    </p>
                                  )}
                                </div>

                                {/* Divider */}
                                <div className={`h-px mb-4 ${
                                  tier.popular
                                    ? 'bg-gradient-to-r from-transparent via-primary-400 to-transparent'
                                    : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
                                }`} />

                                {/* Features list */}
                                <ul className="space-y-2.5 mb-5 flex-grow">
                                  {tier.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                                        tier.popular ? 'bg-primary-500/20' : 'bg-white/10'
                                      }`}>
                                        <svg className="w-2.5 h-2.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                      <span className="text-gray-200 text-xs leading-snug">{feature}</span>
                                    </li>
                                  ))}
                                </ul>

                                {/* CTA button */}
                                <motion.a
                                  href={bot.installUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                  className={`block w-full py-3 px-4 rounded-lg text-center font-bold text-sm transition-all shadow-lg ${
                                    tier.popular
                                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-primary-500/50 hover:shadow-xl'
                                      : 'bg-white/10 text-white hover:bg-white/20 border-2 border-white/20 hover:border-white/30'
                                  }`}
                                >
                                  {tier.popular ? 'Get Started Now' : 'Choose Plan'}
                                </motion.a>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 glass-effect rounded-2xl">
                          <div className="text-6xl mb-4">💰</div>
                          <p className="text-xl text-gray-300 font-semibold">Pricing information coming soon</p>
                          <p className="text-gray-500 mt-2">Check back later for pricing details</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Media Tab */}
                  {activeTab === 'media' && (
                    <motion.div
                      key="media"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Screenshots */}
                      {bot.screenshots && bot.screenshots.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4">Screenshots</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {bot.screenshots.map((screenshot, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                                onClick={() => setLightboxImage(screenshot)}
                              >
                                <img
                                  src={screenshot}
                                  alt={`Screenshot ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                                              transition-opacity flex items-center justify-center">
                                  <span className="text-white font-medium">Click to enlarge</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Videos */}
                      {bot.videos && bot.videos.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4">Videos</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {bot.videos.map((video, index) => (
                              <div key={index} className="aspect-video rounded-lg overflow-hidden bg-black">
                                <video
                                  controls
                                  className="w-full h-full"
                                  src={video}
                                >
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!bot.screenshots?.length && !bot.videos?.length && (
                        <div className="text-center py-12">
                          <p className="text-gray-400">No media available for this bot yet.</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Changelog Tab */}
                  {activeTab === 'changelog' && (
                    <motion.div
                      key="changelog"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl font-semibold text-white mb-4">Changelog</h3>
                      <div className="space-y-3">
                        {bot.changelog?.map((entry, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white/5 rounded-lg border border-white/10 overflow-hidden"
                          >
                            <button
                              onClick={() => toggleChangelog(index)}
                              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <span className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-xs font-mono">
                                  {entry.version}
                                </span>
                                <span className="text-gray-400 text-sm">{entry.date}</span>
                              </div>
                              {expandedChangelog.includes(index) ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </button>

                            <AnimatePresence>
                              {expandedChangelog.includes(index) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="border-t border-white/10"
                                >
                                  <div className="p-4 space-y-2">
                                    {entry.changes?.map((change, idx) => (
                                      <div key={idx} className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                                        <span className="text-gray-300">{change}</span>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )) || (
                          <div className="text-center py-12">
                            <p className="text-gray-400">No changelog available yet.</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Lightbox for images */}
          <AnimatePresence>
            {lightboxImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxImage(null)}
                className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[60] flex items-center justify-center p-4 cursor-pointer"
              >
                <motion.img
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  src={lightboxImage}
                  alt="Enlarged screenshot"
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={() => setLightboxImage(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
  );
};

export default BotModal;
