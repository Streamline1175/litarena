import { motion } from 'framer-motion';
import { ArrowRight, Download, Apple, Monitor } from 'lucide-react';

const ToolCard = ({ tool, onClick, index }) => {
  // Card animation variant
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Status badge colors
  const statusColors = {
    active: 'bg-green-500/20 text-green-300 border-green-400/50',
    'coming-soon': 'bg-blue-500/20 text-blue-300 border-blue-400/50',
    beta: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
    maintenance: 'bg-red-500/20 text-red-300 border-red-400/50'
  };

  // Platform icons
  const PlatformIcon = ({ platform }) => {
    if (platform === 'windows') {
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
        </svg>
      );
    }
    if (platform === 'macos') {
      return <Apple className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  // Determine pricing type
  const getPricingBadge = () => {
    if (!tool.pricing || !tool.pricing.tiers) return null;

    const hasFree = tool.pricing.tiers.some(tier =>
      tier.price === '$0' || tier.name.toLowerCase() === 'free'
    );
    const hasPaid = tool.pricing.tiers.some(tier =>
      tier.price !== '$0' && !tier.name.toLowerCase().includes('trial')
    );

    if (hasFree && !hasPaid) {
      return { label: 'Free', color: 'bg-green-500/20 text-green-300 border-green-400/50' };
    } else if (hasPaid) {
      return { label: 'Paid', color: 'bg-purple-500/20 text-purple-300 border-purple-400/50' };
    }
    return null;
  };

  const pricingBadge = getPricingBadge();

  // Truncate description
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // Format status label
  const getStatusLabel = (status) => {
    const labels = {
      'active': 'Available',
      'coming-soon': 'Coming Soon',
      'beta': 'Beta',
      'maintenance': 'Maintenance'
    };
    return labels[status] || status;
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.03,
        y: -8,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Card container with glassmorphism */}
      <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden
                    shadow-xl hover:shadow-2xl hover:shadow-accent-500/20 transition-all duration-300">

        {/* Tool icon header */}
        <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-accent-500/20 via-primary-500/10 to-transparent flex items-center justify-center">
          <span className="text-6xl">{tool.icon}</span>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/90" />
        </div>

        {/* Content wrapper with padding */}
        <div className="p-6 pt-4">

          {/* Gradient glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/0 via-primary-500/0 to-accent-500/0
                        group-hover:from-accent-500/10 group-hover:via-primary-500/10 group-hover:to-accent-500/10
                        transition-all duration-500 rounded-2xl" />

          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header with badges */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {/* Status badge */}
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[tool.status] || statusColors.active}`}>
                  {getStatusLabel(tool.status)}
                </span>
                {/* Pricing badge */}
                {pricingBadge && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${pricingBadge.color}`}>
                    {pricingBadge.label}
                  </span>
                )}
              </div>
            </div>

            {/* Tool name */}
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-300 transition-colors duration-300">
              {tool.name}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {truncateText(tool.description, 120)}
            </p>

            {/* Platform badges */}
            {tool.platform && tool.platform.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-500">Platforms:</span>
                <div className="flex gap-2">
                  {tool.platform.map((platform) => (
                    <div
                      key={platform}
                      className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg text-gray-400"
                      title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                    >
                      <PlatformIcon platform={platform} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features preview */}
            <div className="space-y-2 mb-4">
              {tool.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-400 flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
              {tool.features.length > 3 && (
                <div className="text-xs text-gray-500 pl-3.5">
                  +{tool.features.length - 3} more features
                </div>
              )}
            </div>

            {/* Action button */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-sm text-gray-400">
                {tool.status === 'active' ? 'Download now' : 'Learn more'}
              </span>
              <motion.div
                className="flex items-center gap-2 text-accent-400 group-hover:text-accent-300"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {tool.status === 'active' ? (
                  <Download className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ToolCard;
