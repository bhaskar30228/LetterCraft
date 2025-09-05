import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare } from 'react-icons/fi';
import './ContactPage.css';
import Navbar from '../components/Navbar';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const API_KEY = "AIzaSyCL_xI3TJLprclLQiGTXdMZx2PUpmd_yuc";

  const SYSTEM_INSTRUCTION = `You are a friendly AI assistant for LetterCraft, a letter builder website. 
  Help users with creating love letters, job applications, school letters, and party invitations. 
  Be professional yet warm in your responses. Keep answers concise (2-3 sentences max).`;

  const callGeminiAPI = async (userPrompt, retries = 3, delay = 1000) => {
    // Using the flash model which has better availability and lower rate limits
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const payload = {
      system_instruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      contents: [{
        parts: [{ text: userPrompt }]
      }]
    };

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          // Handle rate limiting (429) specifically
          if (response.status === 429) {
            if (attempt < retries - 1) {
              await new Promise(resolve => setTimeout(resolve, delay));
              delay *= 2; // Exponential backoff
              continue;
            }
            throw new Error("Our servers are busy. Please try again shortly.");
          }
          
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'API request failed');
        }

        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text || 
               "I couldn't generate a response. Please try again.";
      } catch (err) {
        // Final attempt or non-retryable error
        if (attempt === retries - 1 || !err.message.includes("429")) {
          throw err;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
    return "Failed to get a response after multiple attempts.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsSubmitting(true);
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const botResponse = await callGeminiAPI(input);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (err) {
      let errorMessage = "Sorry, I'm having trouble responding. Please try again later.";
      
      if (err.message.includes('quota') || err.message.includes('rate limit')) {
        errorMessage = "We've reached our temporary limit. Please wait a moment and try again.";
      } else if (err.message.includes('busy')) {
        errorMessage = err.message;
      }
      
      setMessages(prev => [...prev, { 
        text: errorMessage, 
        sender: 'bot' 
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="ai-contact-page">
        {/* Hero Section */}
        <motion.section 
          className="ai-hero"
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
              AI <span className="gradient-text">Assistant</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Get instant help with your letter writing needs
            </motion.p>
          </div>
        </motion.section>

        {/* Main Content */}
        <section className="ai-main-content">
          <div className="container">
            <div className="ai-grid">
              {/* Chat Interface */}
              <motion.div 
                className="ai-chat-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="chat-header">
                  <h2>LetterCraft AI Assistant</h2>
                  <p>Ask me anything about letter writing</p>
                </div>

                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="empty-state">
                      <p>How can I help you with your letter today?</p>
                      <div className="suggestions">
                        <button onClick={() => setInput("How to write a professional cover letter?")}>
                          Cover letter tips
                        </button>
                        <button onClick={() => setInput("What should I include in a love letter?")}>
                          Love letter ideas
                        </button>
                        <button onClick={() => setInput("Format for a school application letter")}>
                          School letter format
                        </button>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`message ${msg.sender}`}
                      >
                        <div className="message-content">
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  {isSubmitting && (
                    <div className="message bot">
                      <div className="message-content typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="chat-input">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    disabled={isSubmitting}
                  />
                  <button 
                    type="submit" 
                    disabled={!input.trim() || isSubmitting}
                  >
                    <FiSend />
                  </button>
                </form>
              </motion.div>

              {/* Contact Sidebar */}
              <motion.div 
                className="ai-contact-sidebar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3>Need more help?</h3>
                <div className="contact-methods">
                  <div className="contact-item">
                    <FiMail className="contact-icon" />
                    <div>
                      <h4>Email</h4>
                      <p>support@lettercraft.com</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <FiPhone className="contact-icon" />
                    <div>
                      <h4>Phone</h4>
                      <p>+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <FiMapPin className="contact-icon" />
                    <div>
                      <h4>Office</h4>
                      <p>123 Letter Street<br />San Francisco, CA</p>
                    </div>
                  </div>
                </div>
                <div className="ai-disclaimer">
                  <p>Our AI assistant may occasionally provide inaccurate information. For important matters, please contact our support team directly.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;