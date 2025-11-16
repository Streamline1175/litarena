import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const BotCard = ({ bot, onClick, index }) => {
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
    beta: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50',
    maintenance: 'bg-red-500/20 text-red-300 border-red-400/50',
    deprecated: 'bg-gray-500/20 text-gray-300 border-gray-400/50'
  };

  // Determine pricing type
  const getPricingBadge = () => {
    if (!bot.pricing || !bot.pricing.tiers) return null;

    const hasFree = bot.pricing.tiers.some(tier =>
      tier.price === '$0' || tier.name.toLowerCase() === 'free'
    );
    const hasTrial = bot.pricing.tiers.some(tier =>
      tier.name.toLowerCase().includes('trial')
    );
    const hasPaid = bot.pricing.tiers.some(tier =>
      tier.price !== '$0' && !tier.name.toLowerCase().includes('trial')
    );

    if (hasFree && !hasPaid) {
      return { label: 'Free', color: 'bg-green-500/20 text-green-300 border-green-400/50' };
    } else if (hasTrial) {
      return { label: 'Free Trial', color: 'bg-blue-500/20 text-blue-300 border-blue-400/50' };
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
      <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden
                    shadow-xl hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-300">

        {/* Gradient glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-accent-500/0 to-primary-500/0
                      group-hover:from-primary-500/10 group-hover:via-accent-500/10 group-hover:to-primary-500/10
                      transition-all duration-500 rounded-2xl" />

        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.3), rgba(217, 70, 239, 0.3), rgba(14, 165, 233, 0.3))',
            backgroundSize: '200% 100%',
            filter: 'blur(20px)',
            zIndex: -1
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header section */}
          <div className="flex items-start justify-between mb-4">
            {/* Bot icon and name */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 ring-2 ring-white/10">
                <img
                  src={bot.icon}
                  alt={`${bot.name} icon`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-2xl">🤖</div>';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-1 truncate group-hover:text-primary-300 transition-colors">
                  {bot.name}
                </h3>
                {/* Status and Pricing badges */}
                <div className="flex gap-2">
                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium border ${statusColors[bot.status]}`}>
                    {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                  </span>
                  {pricingBadge && (
                    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium border ${pricingBadge.color}`}>
                      {pricingBadge.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Arrow icon */}
            <motion.div
              className="text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-4 flex-1 leading-relaxed">
            {truncateText(bot.description)}
          </p>

          {/* Feature pills */}
          {bot.features && bot.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {bot.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary-500/10 text-primary-300 rounded-full text-xs font-medium
                           border border-primary-400/20 backdrop-blur-sm"
                >
                  {feature}
                </span>
              ))}
              {bot.features.length > 3 && (
                <span className="px-3 py-1 bg-white/5 text-gray-400 rounded-full text-xs font-medium border border-white/10">
                  +{bot.features.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Install Button */}
          {bot.installUrl && (
            <motion.a
              href={bot.installUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-auto w-full py-2.5 px-4 bg-gradient-to-r from-primary-600 to-accent-600
                       text-white font-semibold rounded-xl text-center text-sm
                       hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300
                       flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Add to Discord
            </motion.a>
          )}
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          }}
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 1
          }}
        />
      </div>
    </motion.div>
  );
};

export default BotCard;
