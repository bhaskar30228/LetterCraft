import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TemplateSwitcher.css';
import { useParams } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { RiMagicLine } from 'react-icons/ri';

// Import all your template components
import LoveLetter from '../components/LoveLetter';
import VintageLetter from '../components/VintageLetter';
import ModernLetter from '../components/ModernLetter';
import JobCoverLetter from '../components/JobCoverLetter';
import LeaveApplicationJob from '../components/LeaveApplicationJob';
import ResignationLetter from '../components/ResignationLetter';
import SchoolApplication from '../components/SchoolApplication';
import BusinessProposal from '../components/BusinessProposal';
import InvitationLetter from '../components/InvitationLetter';
import PersonalLetter from '../components/PersonalLetter';

const TemplateSwitcher = () => {
  const { categoryId } = useParams();
  
  // Define all available templates organized by category
  const allTemplates = {
    'love-letters': [
      { id: 1, name: 'Romantic', component: <LoveLetter />, color: '#FF7EB9' },
      { id: 2, name: 'Vintage', component: <VintageLetter />, color: '#A29BFE' },
      { id: 3, name: 'Modern', component: <ModernLetter />, color: '#6C5CE7' }
    ],
    'job-letters': [
      { id: 1, name: 'Cover Letter', component: <JobCoverLetter />, color: '#7FDBFF' },
      { id: 2, name: 'Resignation Letter', component: <LeaveApplicationJob />, color: '#39CCCC' },
      { id: 3, name: 'Thank You Letter', component: <ResignationLetter />, color: '#01FF70' }
    ],
    'school-letters': [
      { id: 1, name: 'Application', component: <SchoolApplication />, color: '#FFDC00' }
    ],
    'business-proposals': [
      { id: 1, name: 'Business Proposal', component: <BusinessProposal />, color: '#FF851B' },
    ],
    'invitations': [
      { id: 1, name: 'Invitation', component: <InvitationLetter />, color: '#F012BE' },
    ],
    'personal-letters': [
      { id: 1, name: 'Personal Letter', component: <PersonalLetter />, color: '#B10DC9' },
    ],
  };

  // Get the templates for the current category
  const currentTemplates = allTemplates[categoryId] || [];
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  const nextTemplate = () => {
    setDirection(1);
    setCurrentTemplateIndex(prev => (prev + 1) % currentTemplates.length);
  };

  const prevTemplate = () => {
    setDirection(-1);
    setCurrentTemplateIndex(prev => (prev - 1 + currentTemplates.length) % currentTemplates.length);
  };

  if (currentTemplates.length === 0) {
    return (
      <motion.div 
        className="no-templates"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <RiMagicLine className="magic-icon" />
        <h2>No templates available for this category</h2>
        <p>We're working on adding more templates soon!</p>
      </motion.div>
    );
  }

  const currentColor = currentTemplates[currentTemplateIndex]?.color || '#6C5CE7';

  return (
    <motion.div 
      className="template-switcher"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background gradient */}
      <motion.div 
        className="background-gradient"
        animate={{ background: currentColor }}
        transition={{ duration: 1 }}
      />
      
      {/* Floating decorative elements */}
      <div className="decorative-elements">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="decor"
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
              background: currentColor,
              '--size': `${5 + i * 2}rem`,
              '--delay': `${i * 0.5}s`,
              '--pos-x': `${10 + i * 15}%`,
              '--pos-y': `${20 + (i % 3) * 20}%`
            }}
          />
        ))}
      </div>

      <div className="template-header">
        <motion.h2 
          className="category-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {categoryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </motion.h2>
        <motion.div 
          className="template-counter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span>{currentTemplateIndex + 1}</span>
          <span>/</span>
          <span>{currentTemplates.length}</span>
        </motion.div>
      </div>
      
      <div className="template-container">
        <AnimatePresence custom={direction}>
          <motion.div
            key={currentTemplateIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="template-display"
          >
            {currentTemplates[currentTemplateIndex].component}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="template-navigation">
        <motion.button 
          onClick={prevTemplate} 
          className="nav-button prev-button"
          disabled={currentTemplates.length <= 1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FiChevronLeft className="nav-icon" />
          Previous
        </motion.button>
        
        <motion.span 
          className="template-name"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {currentTemplates[currentTemplateIndex].name} Style
        </motion.span>
        
        <motion.button 
          onClick={nextTemplate} 
          className="nav-button next-button"
          disabled={currentTemplates.length <= 1}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          Next
          <FiChevronRight className="nav-icon" />
        </motion.button>
      </div>
      
      {/* Template indicators */}
      {currentTemplates.length > 1 && (
        <div className="template-indicators">
          {currentTemplates.map((_, index) => (
            <motion.div
              key={index}
              className={`indicator ${index === currentTemplateIndex ? 'active' : ''}`}
              onClick={() => {
                setDirection(index > currentTemplateIndex ? 1 : -1);
                setCurrentTemplateIndex(index);
              }}
              whileHover={{ scale: 1.2 }}
              style={{ background: currentColor }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TemplateSwitcher;