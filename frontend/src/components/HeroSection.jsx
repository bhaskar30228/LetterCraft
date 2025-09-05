import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HeroSection.css';
import { FiArrowRight, FiDownload, FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const templateData = [
  {
    id: 1,
    title: "Romantic Love Letters",
    description: "Express your deepest feelings with our beautifully crafted love letter templates.",
    color: "#FF7EB9",
    icon: "💌",
    gradient: "linear-gradient(135deg, #FF7EB9 0%, #FF758C 100%)",
    particles: ["❤️", "✨", "🥰"]
  },
  {
    id: 2,
    title: "Professional Cover Letters",
    description: "Impress employers with our professional and customizable cover letter designs.",
    color: "#7FDBFF",
    icon: "💼",
    gradient: "linear-gradient(135deg, #7FDBFF 0%, #39CCCC 100%)",
    particles: ["📄", "📝", "👔"]
  },
  {
    id: 3,
    title: "Formal Business Letters",
    description: "Maintain professionalism with our elegant business correspondence templates.",
    color: "#2ECC40",
    icon: "🏢",
    gradient: "linear-gradient(135deg, #2ECC40 0%, #01FF70 100%)",
    particles: ["📊", "📈", "💼"]
  },
  {
    id: 4,
    title: "Heartfelt Apology Letters",
    description: "Mend relationships with our sincere apology letter formats.",
    color: "#FFDC00",
    icon: "🙏",
    gradient: "linear-gradient(135deg, #FFDC00 0%, #FF851B 100%)",
    particles: ["😔", "🤗", "💛"]
  }
];

const HeroSection = () => {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();
  const { isLoggedIn, open, setOpen } = useContext(AuthContext);

  // Auto-rotate templates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentTemplate((prev) => (prev + 1) % templateData.length);
          setIsAnimating(false);
        }, 500);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Create floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          content: templateData[currentTemplate].particles[
            Math.floor(Math.random() * templateData[currentTemplate].particles.length)
          ],
          size: Math.random() * 20 + 10,
          left: Math.random() * 100,
          top: Math.random() * 100,
          animationDuration: Math.random() * 15 + 10,
          delay: Math.random() * 5
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const particleInterval = setInterval(generateParticles, 3000);
    return () => clearInterval(particleInterval);
  }, [currentTemplate]);

  const nextTemplate = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTemplate((prev) => (prev + 1) % templateData.length);
      setIsAnimating(false);
    }, 500);
  }, [isAnimating]);

  const handleClick = () => {
    isLoggedIn ? navigate('/templates') : setOpen(true);
  };

  return (
    <section className="hero-section">
      {/* Floating particles background */}
      <div className="particles-container">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="particle"
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              y: -100,
              x: particle.left % 2 === 0 ? 20 : -20
            }}
            transition={{ 
              duration: particle.animationDuration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              fontSize: `${particle.size}px`,
              filter: `blur(${particle.size > 20 ? 1 : 0}px)`
            }}
          >
            {particle.content}
          </motion.span>
        ))}
      </div>

      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hero-title"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Craft Perfect Letters
            </motion.span>
            <br />
            <motion.span 
              className="gradient-text-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="gradient-text">With Ease</span>
              <span className="gradient-shadow">With Ease</span>
            </motion.span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hero-subtitle"
          >
            Beautifully designed templates for every occasion, helping you express yourself effortlessly.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hero-cta"
          >
            <motion.button 
              onClick={handleClick} 
              className="primary-btn"
              whileHover={{ 
                y: -5,
                scale: 1.05,
                boxShadow: "0 15px 30px rgba(255, 126, 185, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredBtn('primary')}
              onHoverEnd={() => setHoveredBtn(null)}
            >
              <FiEdit2 className="btn-icon" />
              <span>Start Creating</span>
              {hoveredBtn === 'primary' && (
                <motion.span 
                  className="btn-ripple"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </motion.button>
            
            <motion.button 
              className="secondary-btn"
              whileHover={{ 
                y: -5,
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setHoveredBtn('secondary')}
              onHoverEnd={() => setHoveredBtn(null)}
            >
              <FiDownload className="btn-icon" />
              <span>Explore Templates</span>
              {hoveredBtn === 'secondary' && (
                <motion.span 
                  className="btn-ripple"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Right Template Showcase */}
        <div className="template-showcase">
          <AnimatePresence mode='wait'>
            <motion.div
              key={templateData[currentTemplate].id}
              initial={{ opacity: 0, x: 100, rotateY: 30 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                rotateY: 0,
                background: templateData[currentTemplate].gradient
              }}
              exit={{ opacity: 0, x: -100, rotateY: -30 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="template-card"
            >
              <motion.div 
                className="template-icon"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {templateData[currentTemplate].icon}
              </motion.div>
              
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {templateData[currentTemplate].title}
              </motion.h3>
              
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {templateData[currentTemplate].description}
              </motion.p>
              
              <div className="template-indicators">
                {templateData.map((_, index) => (
                  <motion.span 
                    key={index}
                    className={`indicator ${index === currentTemplate ? 'active' : ''}`}
                    onClick={() => {
                      if (!isAnimating) setCurrentTemplate(index);
                    }}
                    whileHover={{ scale: 1.3 }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.button 
            className="next-template" 
            onClick={nextTemplate}
            aria-label="Next template"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiArrowRight />
          </motion.button>
        </div>
      </div>

      {/* Animated decorative elements */}
      <div className="decorative-elements">
        <motion.div 
          className="decor decor-1"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="decor decor-2"
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        
        <motion.div 
          className="decor decor-3"
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;