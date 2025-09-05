import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiUsers, FiCode, FiHeart, FiAward, FiEdit } from 'react-icons/fi';
import './AboutPage.css';
import Navbar from '../components/Navbar';

const AboutPage = () => {
  return (
    <>
      <Navbar/>
      <div className="about-page">
        {/* Hero Section */}
        <motion.section 
          className="about-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-content">
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Crafting <span className="gradient-text">Beautiful Letters</span> Since 2023
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Transforming your words into elegant, professional communications
            </motion.p>
          </div>
          <div className="hero-pattern"></div>
        </motion.section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <motion.div 
              className="mission-card"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <FiHeart className="mission-icon" />
              <h2>Our Mission</h2>
              <p>
                To empower individuals and businesses to communicate effectively through beautifully designed letter templates that save time while making every message special.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Why Choose <span className="gradient-text">LetterCraft</span>
            </motion.h2>
            <div className="features-grid">
              {[
                { icon: <FiMail />, title: "100+ Templates", description: "Professionally designed templates for every occasion" },
                { icon: <FiUsers />, title: "User-Friendly", description: "Intuitive interface that makes letter writing simple" },
                { icon: <FiCode />, title: "Customizable", description: "Personalize every aspect of your letters" },
                { icon: <FiEdit />, title: "Easy Editing", description: "Real-time preview as you compose your letter" },
                { icon: <FiAward />, title: "Premium Quality", description: "Designs created by professional letter writers" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="feature-card"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="feature-icon-container">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <motion.h2 
              className="section-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Meet Our <span className="gradient-text">Creative Team</span>
            </motion.h2>
            <div className="team-grid">
              {[
                { 
                  name: "Alex Johnson", 
                  role: "Founder & CEO", 
                  bio: "Passionate about helping people communicate better",
                  expertise: "Communication Strategy"
                },
                { 
                  name: "Sarah Williams", 
                  role: "Design Lead", 
                  bio: "Creates beautiful templates that tell stories",
                  expertise: "Visual Design"
                },
                { 
                  name: "Michael Chen", 
                  role: "Lead Developer", 
                  bio: "Builds the technology that makes it all work",
                  expertise: "Web Development"
                }
              ].map((member, index) => (
                <motion.div 
                  key={index}
                  className="team-card"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="team-avatar">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3>{member.name}</h3>
                  <p className="role">{member.role}</p>
                  <p className="bio">{member.bio}</p>
                  <div className="expertise">
                    <span>{member.expertise}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;