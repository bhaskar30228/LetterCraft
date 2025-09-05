import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './TemplatesCategories.css';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';
import SignPage from '../components/SignPage';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { RiMagicLine } from 'react-icons/ri';
import { FiArrowRight, FiSearch } from 'react-icons/fi';

const TemplatesCategories = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const templateCategories = [
    {
      id: 'love-letters',
      title: 'Love Letters',
      description: 'Express your deepest feelings with our romantic templates',
      icon: '💌',
      color: '#ff6b8b',
      bgGradient: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
      tags: ['romantic', 'emotional', 'personal']
    },
    {
      id: 'job-letters',
      title: 'Job Letters',
      description: 'Professional templates for resumes, cover letters and more',
      icon: '💼',
      color: '#4a90e2',
      bgGradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      tags: ['professional', 'career', 'business']
    },
    {
      id: 'school-letters',
      title: 'School Letters',
      description: 'Perfect templates for academic purposes',
      icon: '📚',
      color: '#6bbd68',
      bgGradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      tags: ['academic', 'education', 'formal']
    },
    {
      id: 'business-proposals',
      title: 'Business Proposals',
      description: 'Impress clients with professional business templates',
      icon: '📈',
      color: '#9b59b6',
      bgGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      tags: ['professional', 'business', 'corporate']
    },
    {
      id: 'invitations',
      title: 'Invitations',
      description: 'Beautiful designs for your special events',
      icon: '🎉',
      color: '#e67e22',
      bgGradient: 'linear-gradient(135deg, #ffb347 0%, #ffcc33 100%)',
      tags: ['events', 'celebration', 'personal']
    },
    {
      id: 'personal-letters',
      title: 'Personal Letters',
      description: 'Heartfelt templates for friends and family',
      icon: '✉️',
      color: '#3498db',
      bgGradient: 'linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)',
      tags: ['personal', 'family', 'friends']
    }
  ];

  const testimonials = [
    {
      id: 1,
      quote: "These templates saved me hours of work! The love letters are perfect.",
      author: "Sarah J.",
      rating: 5,
      avatar: "👩"
    },
    {
      id: 2,
      quote: "Got the job thanks to their professional cover letter templates!",
      author: "Michael T.",
      rating: 5,
      avatar: "👨"
    },
    {
      id: 3,
      quote: "My business proposals have never looked better. Clients are impressed!",
      author: "Alexandra K.",
      rating: 4,
      avatar: "👩‍💼"
    }
  ];

  const filters = [
    { id: 'all', label: 'All Templates' },
    { id: 'personal', label: 'Personal' },
    { id: 'professional', label: 'Professional' },
    { id: 'academic', label: 'Academic' },
    { id: 'business', label: 'Business' }
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/templates/${categoryId.id}`);
  };

  const filteredCategories = templateCategories.filter(category => {
    const matchesSearch = category.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         category.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || category.tags.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  if (!isLoggedIn) {
    return <SignPage />;
  }

  return (
    <>
      <Navbar />
      <div className="templates-categories-page">
        {/* Enhanced Hero Section */}
        <motion.section 
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-content">
            <motion.div 
              className="hero-title-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span 
                className="title-gradient"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Discover Our
              </motion.span>
              <motion.h1 
                className="title-main"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Beautiful Templates
              </motion.h1>
            </motion.div>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Perfectly crafted designs for every occasion and purpose
            </motion.p>
            
            <motion.div 
              className="search-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="search-input">
                <FiSearch className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search templates..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="scrolling-arrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.span
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ↓
              </motion.span>
            </motion.div>
          </div>
          
          <div className="hero-bg-elements">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="hero-bg-circle"
                animate={{
                  y: [0, -20, 0],
                  x: [0, i % 2 === 0 ? 15 : -15, 0],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  '--size': `${5 + i * 2}rem`,
                  '--delay': `${i * 0.5}s`,
                  '--pos-x': `${10 + i * 15}%`,
                  '--pos-y': `${20 + (i % 3) * 20}%`,
                  '--color': i % 2 === 0 ? '#6c5ce7' : '#fd79a8'
                }}
              />
            ))}
          </div>
        </motion.section>

        {/* Templates Grid */}
        <div className="templates-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Choose Your Template Style</h2>
            <p className="section-subtitle">Browse our collection of beautifully designed templates</p>
            
            <div className="filters">
              {filters.map(filter => (
                <motion.button
                  key={filter.id}
                  className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          {filteredCategories.length === 0 ? (
            <motion.div 
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <RiMagicLine className="magic-icon" />
              <h3>No templates found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </motion.div>
          ) : (
            <motion.div 
              className="categories-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence>
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    className="category-card"
                    onClick={() => handleCategoryClick(category)}
                    whileHover={{ 
                      y: -10,
                      boxShadow: `0 15px 30px ${hexToRgba(category.color, 0.3)}`
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{
                      '--card-color': category.color,
                      '--card-bg-gradient': category.bgGradient
                    }}
                  >
                    <div className="card-icon">{category.icon}</div>
                    <div className="card-content">
                      <h3>{category.title}</h3>
                      <p>{category.description}</p>
                      <motion.div 
                        className="explore-btn"
                        whileHover={{ x: 5 }}
                      >
                        Explore Templates <FiArrowRight />
                      </motion.div>
                    </div>
                    <div className="card-tags">
                      {category.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Testimonials Section */}
        <motion.section 
          className="testimonial-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="testimonial-content">
            <motion.div
              className="testimonial-header"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">What Our Users Say</h2>
              <p className="section-subtitle">Join thousands of satisfied users</p>
            </motion.div>
            
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id}
                  className="testimonial-card"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <FaQuoteLeft className="quote-icon" />
                  <div className="quote">{testimonial.quote}</div>
                  <div className="author">{testimonial.author}</div>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < testimonial.rating ? 'star filled' : 'star'} 
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="testimonial-bg-elements">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="testimonial-bg-circle"
                animate={{
                  y: [0, -20, 0],
                  x: [0, i % 2 === 0 ? 15 : -15, 0]
                }}
                transition={{
                  duration: 15 + i * 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  '--size': `${3 + i * 0.5}rem`,
                  '--delay': `${i * 0.5}s`,
                  '--pos-x': `${10 + i * 15}%`,
                  '--pos-y': `${20 + (i % 3) * 20}%`,
                  '--color': i % 2 === 0 ? 'rgba(108, 92, 231, 0.1)' : 'rgba(253, 121, 168, 0.1)'
                }}
              />
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="cta-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="cta-content">
            <h2>Ready to Create Something Amazing?</h2>
            <p>Start with one of our professionally designed templates today</p>
            <motion.button
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse All Templates
            </motion.button>
          </div>
        </motion.section>
      </div>
    </>
  );
};

// Helper function to convert hex to rgba
function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default TemplatesCategories;