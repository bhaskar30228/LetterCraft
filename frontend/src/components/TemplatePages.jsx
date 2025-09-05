import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TemplatePages.css';

const TemplatesPage = () => {

  // Template categories data
  const templateCategories = [
    {
      id: 1,
      title: "Romantic Love Letters",
      description: "Express your deepest feelings with our beautifully crafted love letter templates.",
      color: "#FF6B6B",
      icon: "💌",
      templates: [
        { id: 101, name: 'First Love Letter', preview: 'Express your feelings for the first time' },
        { id: 102, name: 'Anniversary Letter', preview: 'Celebrate your relationship milestones' },
        { id: 103, name: 'Long Distance Love', preview: 'For partners separated by distance' }
      ]
    },
    {
      id: 2,
      title: "Professional Cover Letters",
      description: "Impress employers with our professional and customizable cover letter designs.",
      color: "#6C5CE7",
      icon: "💼",
      templates: [
        { id: 201, name: 'Standard Job Application', preview: 'For most job applications' },
        { id: 202, name: 'Creative Industry Cover', preview: 'For design/artistic positions' },
        { id: 203, name: 'Executive Level Cover', preview: 'For senior management positions' }
      ]
    },
    {
      id: 3,
      title: "Formal Business Letters",
      description: "Maintain professionalism with our elegant business correspondence templates.",
      color: "#00B894",
      icon: "🏢",
      templates: [
        { id: 301, name: 'Client Proposal', preview: 'Formal business proposal template' },
        { id: 302, name: 'Partnership Request', preview: 'For proposing business collaborations' },
        { id: 303, name: 'Official Complaint', preview: 'Formal complaint letter format' }
      ]
    },
    {
      id: 4,
      title: "Heartfelt Apology Letters",
      description: "Mend relationships with our sincere apology letter formats.",
      color: "#FDCB6E",
      icon: "🙏",
      templates: [
        { id: 401, name: 'Personal Apology', preview: 'For friends and family' },
        { id: 402, name: 'Professional Apology', preview: 'For workplace situations' },
        { id: 403, name: 'Customer Service Apology', preview: 'For business to customer' }
      ]
    },
    {
      id: 5,
      title: "Resignation Letters",
      description: "Leave your job gracefully with professional resignation templates.",
      color: "#FD79A8",
      icon: "📝",
      templates: [
        { id: 501, name: 'Standard Resignation', preview: 'Professional two-week notice' },
        { id: 502, name: 'Retirement Letter', preview: 'For announcing retirement' },
        { id: 503, name: 'Counteroffer Response', preview: 'For responding to retention offers' }
      ]
    },
    {
      id: 6,
      title: "Thank You Letters",
      description: "Show appreciation with our thoughtful thank you templates.",
      color: "#0984E3",
      icon: "🙌",
      templates: [
        { id: 601, name: 'Job Interview Thanks', preview: 'After an interview' },
        { id: 602, name: 'Gift Appreciation', preview: 'For thanking gift givers' },
        { id: 603, name: 'General Gratitude', preview: 'For any thankful occasion' }
      ]
    },
    {
      id: 7,
      title: "Invitation Letters",
      description: "Create beautiful invitations for any event or occasion.",
      color: "#E17055",
      icon: "🎉",
      templates: [
        { id: 701, name: 'Wedding Invitation', preview: 'Formal wedding invite' },
        { id: 702, name: 'Business Event', preview: 'Corporate gathering invite' },
        { id: 703, name: 'Birthday Party', preview: 'Casual birthday celebration' }
      ]
    },
    {
      id: 8,
      title: "Recommendation Letters",
      description: "Write compelling recommendations for colleagues and students.",
      color: "#00CEC9",
      icon: "🌟",
      templates: [
        { id: 801, name: 'Employee Reference', preview: 'For former colleagues' },
        { id: 802, name: 'Academic Reference', preview: 'For students/graduates' },
        { id: 803, name: 'Character Reference', preview: 'Personal recommendation' }
      ]
    }
  ];


  return (
    <div className="templates-container">
      <header className="templates-header">
      </header>

      <main className="templates-main">
          <>
            <h2>Choose a Template Category</h2>
            <div className="categories-grid">
              {templateCategories.map(category => (
                <div 
                  key={category.id} 
                  className="category-card"
                  onClick={() => handleCategorySelect(category)}
                  style={{ backgroundColor: category.color }}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>
              ))}
            </div>
          </>
       
      </main>
    </div>
  );
};

export default TemplatesPage;