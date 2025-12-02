import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, Apple, Clock, HardDrive, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const ToolModal = ({ tool, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState(null);

  if (!tool) return null;

  // Platform icons
  const PlatformIcon = ({ platform }) => {
    if (platform === 'windows') {
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
        </svg>
      );
    }
    if (platform === 'macos') {
      return <Apple className="w-5 h-5" />;
    }
    return null;
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'changelog', label: 'Changelog' },
  ];

  // Format status label
  const getStatusLabel = (status) => {
    const labels = {
      'active': 'Available',
      'available': 'Available',
      'coming-soon': 'Coming Soon',
      'beta': 'Beta',
      'maintenance': 'Maintenance'
    };
    return labels[status] || status;
  };

  const statusColors = {
    active: 'bg-green-500/20 text-green-300 border-green-400/50',
    available: 'bg-green-500/20 text-green-300 border-green-400/50',
    'coming-soon': 'bg-blue-500/20 text-blue-300 border-blue-400/50',
    beta: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
    maintenance: 'bg-red-500/20 text-red-300 border-red-400/50'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-3xl border border-white/10 shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="relative p-8 pb-4">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 via-primary-500/10 to-transparent rounded-t-3xl" />
          
          <div className="relative flex items-start gap-6">
            {/* Tool icon */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-500/30 to-primary-500/30 border border-white/20 overflow-hidden flex items-center justify-center shadow-xl">
              {tool.icon && tool.icon.startsWith('/') ? (
                <img
                  src={tool.icon}
                  alt={`${tool.name} icon`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.outerHTML = `<span class="text-5xl">${tool.icon}</span>`;
                  }}
                />
              ) : (
                <span className="text-5xl">{tool.icon}</span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-white">{tool.name}</h2>
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusColors[tool.status]}`}>
                  {getStatusLabel(tool.status)}
                </span>
              </div>
              
              <p className="text-gray-300 text-lg mb-4">{tool.description}</p>

              {/* Platform badges */}
              {tool.platform && tool.platform.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Available on:</span>
                  <div className="flex gap-2">
                    {tool.platform.map((platform) => (
                      <div
                        key={platform}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-gray-300"
                      >
                        <PlatformIcon platform={platform} />
                        <span className="text-sm capitalize">{platform}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Download button */}
        <div className="px-8 py-4">
          {(tool.status === 'active' || tool.status === 'available') && tool.downloadUrl ? (
            <a
              href={tool.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-400 hover:to-primary-400 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-accent-500/30"
            >
              <Download className="w-5 h-5" />
              Download Now
            </a>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl text-gray-400 font-semibold cursor-not-allowed">
              <Clock className="w-5 h-5" />
              Coming Soon
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="px-8 border-b border-white/10">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabTool"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 to-primary-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* System Requirements */}
                {tool.requirements && (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">System Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {tool.requirements.os && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <Cpu className="w-5 h-5 text-accent-400" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Operating System</div>
                            <div className="text-sm text-gray-300">{tool.requirements.os}</div>
                          </div>
                        </div>
                      )}
                      {tool.requirements.storage && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <HardDrive className="w-5 h-5 text-accent-400" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Storage</div>
                            <div className="text-sm text-gray-300">{tool.requirements.storage}</div>
                          </div>
                        </div>
                      )}
                      {tool.requirements.memory && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <Cpu className="w-5 h-5 text-accent-400" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Memory</div>
                            <div className="text-sm text-gray-300">{tool.requirements.memory}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                {tool.pricing && tool.pricing.tiers && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Pricing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tool.pricing.tiers.map((tier, idx) => (
                        <div
                          key={idx}
                          className={`p-5 rounded-xl border ${
                            tier.popular
                              ? 'bg-gradient-to-br from-accent-500/20 to-primary-500/20 border-accent-400/50'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          {tier.popular && (
                            <div className="text-xs text-accent-400 font-semibold mb-2">MOST POPULAR</div>
                          )}
                          <div className="text-lg font-bold text-white mb-1">{tier.name}</div>
                          <div className="text-2xl font-bold text-white mb-4">
                            {tier.price}
                            {tier.period && tier.price !== '$0' && (
                              <span className="text-sm text-gray-400 font-normal">/{tier.period}</span>
                            )}
                          </div>
                          <ul className="space-y-2">
                            {tier.features.map((feature, fidx) => (
                              <li key={fidx} className="flex items-center gap-2 text-sm text-gray-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'features' && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-accent-500/30 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-accent-400 mt-2 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'changelog' && (
              <motion.div
                key="changelog"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {tool.changelog && tool.changelog.length > 0 ? (
                  <div className="space-y-4">
                    {tool.changelog.map((entry, idx) => (
                      <div
                        key={idx}
                        className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedSection(expandedSection === idx ? null : idx)}
                          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-accent-500/20 text-accent-300 rounded-lg text-sm font-mono">
                              v{entry.version}
                            </span>
                            <span className="text-gray-400 text-sm">{entry.date}</span>
                          </div>
                          {expandedSection === idx ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <AnimatePresence>
                          {expandedSection === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-white/10"
                            >
                              <ul className="p-4 space-y-2">
                                {entry.changes.map((change, cidx) => (
                                  <li key={cidx} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="text-accent-400 mt-1">•</span>
                                    {change}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No changelog available yet.</p>
                    <p className="text-sm mt-2">Check back after the first release!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ToolModal;
