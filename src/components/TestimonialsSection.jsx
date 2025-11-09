import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getReviews } from '../services/api';

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadReviews();
  }, []);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(nextReview, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  if (isLoading || reviews.length === 0) {
    return null;
  }

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Loved by Communities
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See what server admins and users are saying about our bots
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Navigation buttons */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10
                     p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20
                     hover:bg-white/20 transition-all group"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:text-primary-400 transition-colors" />
          </button>

          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10
                     p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20
                     hover:bg-white/20 transition-all group"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:text-primary-400 transition-colors" />
          </button>

          {/* Testimonial Cards */}
          <div className="relative h-96">
            {reviews.map((review, index) => {
              const isActive = index === currentIndex;
              const isPrev = index === (currentIndex - 1 + reviews.length) % reviews.length;
              const isNext = index === (currentIndex + 1) % reviews.length;

              let position = 'translate-x-0 scale-75 opacity-0';
              if (isActive) position = 'translate-x-0 scale-100 opacity-100 z-10';
              else if (isPrev) position = '-translate-x-full scale-75 opacity-30';
              else if (isNext) position = 'translate-x-full scale-75 opacity-30';

              return (
                <motion.div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ${position}`}
                  style={{ transformOrigin: 'center' }}
                >
                  <div className="glass-effect p-8 md:p-12 rounded-3xl border border-white/10 h-full flex flex-col justify-between">
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-6 h-6 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <blockquote className="text-xl md:text-2xl text-gray-200 mb-8 flex-1 italic">
                      "{review.comment}"
                    </blockquote>

                    {/* User info */}
                    <div className="flex items-center gap-4">
                      <img
                        src={review.avatar}
                        alt={review.user}
                        className="w-14 h-14 rounded-full ring-2 ring-primary-400/50"
                      />
                      <div>
                        <div className="font-semibold text-white text-lg">{review.user}</div>
                        <div className="text-gray-400 text-sm">
                          Using {review.botName}
                        </div>
                      </div>
                    </div>

                    {/* Decorative quote marks */}
                    <div className="absolute top-6 right-6 text-8xl text-primary-500/10 font-serif leading-none">
                      "
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary-400'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
