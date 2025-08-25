import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ThumbsUp, Share2, BookOpen, Activity, Brain, Utensils, Shield } from 'lucide-react';

const HealthTipsSection = () => {
  const [healthTips, setHealthTips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

import api from '../../services/api';

// ... (rest of the imports)

// ...

  // Fetch health tips from API
  useEffect(() => {
    const fetchHealthTips = async () => {
      try {
        const response = await api.get(`/admin/health-tips/active?category=${selectedCategory}`);
        if (response.data && response.data.length > 0) {
          setHealthTips(response.data);
        } else {
          // Fallback to sample data if API fails
          const fallbackHealthTips = [
            {
              id: 1,
              title: '5 Foods to Boost Your Immunity',
              content: 'Include citrus fruits, garlic, ginger, spinach, and yogurt in your daily diet to strengthen your immune system naturally.',
              category: 'nutrition',
              image: '/api/placeholder/300/200',
              isActive: true,
              createdAt: '2024-01-15',
              likes: 245
            },
            {
              id: 2,
              title: 'Morning Exercise Benefits',
              content: 'Starting your day with 30 minutes of exercise can improve your mood, energy levels, and overall health significantly.',
              category: 'fitness',
              image: '/api/placeholder/300/200',
              isActive: true,
              createdAt: '2024-01-14',
              likes: 189
            }
          ];
          setHealthTips(fallbackHealthTips);
        }
      } catch (error) {
        console.error('Error fetching health tips:', error);
        // Fallback to sample data
        const fallbackHealthTips = [
          {
            id: 1,
            title: '5 Foods to Boost Your Immunity',
            content: 'Include citrus fruits, garlic, ginger, spinach, and yogurt in your daily diet to strengthen your immune system naturally.',
            category: 'nutrition',
            image: '/api/placeholder/300/200',
            isActive: true,
            createdAt: '2024-01-15',
            likes: 245
          }
        ];
        setHealthTips(fallbackHealthTips);
      }
    };

    fetchHealthTips();
  }, [selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Tips', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils, color: 'from-green-500 to-green-600' },
    { id: 'fitness', label: 'Fitness', icon: Activity, color: 'from-orange-500 to-orange-600' },
    { id: 'mental-health', label: 'Mental Health', icon: Brain, color: 'from-purple-500 to-purple-600' },
    { id: 'lifestyle', label: 'Lifestyle', icon: Heart, color: 'from-pink-500 to-pink-600' },
    { id: 'prevention', label: 'Prevention', icon: Shield, color: 'from-indigo-500 to-indigo-600' }
  ];

  const filteredTips = selectedCategory === 'all' 
    ? healthTips 
    : healthTips.filter(tip => tip.category === selectedCategory);

  const handleLike = async (tipId) => {
    // Optimistic UI update
    setHealthTips(prev => prev.map(tip =>
      tip.id === tipId ? { ...tip, likes: tip.likes + 1 } : tip
    ));

    try {
      await api.post(`/admin/health-tips/${tipId}/like`);
      // No need to update state again if API call is successful
    } catch (error) {
      console.error('Error liking health tip:', error);
      // Revert the state if API call fails
      setHealthTips(prev => prev.map(tip => 
        tip.id === tipId ? { ...tip, likes: tip.likes - 1 } : tip
      ));
      // Optionally: show a toast notification to the user
    }
  };

  const handleShare = (tip) => {
    if (navigator.share) {
      navigator.share({
        title: tip.title,
        text: tip.content,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${tip.title}\n\n${tip.content}\n\nShared from Rainscare`);
      alert('Health tip copied to clipboard!');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Daily Health Tips
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert-curated health tips to help you live a healthier, happier life every day
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span>{category.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Health Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                <img
                  src={tip.image}
                  alt={tip.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${
                    categories.find(cat => cat.id === tip.category)?.color || 'from-blue-500 to-blue-600'
                  }`}>
                    {categories.find(cat => cat.id === tip.category)?.label || tip.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {tip.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {tip.content}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(tip.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors group/like"
                    >
                      <Heart className="w-5 h-5 group-hover/like:fill-current" />
                      <span className="text-sm font-medium">{tip.likes}</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare(tip)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>

                  <div className="text-sm text-gray-400">
                    {new Date(tip.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show more button */}
        {filteredTips.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              View More Health Tips
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HealthTipsSection;