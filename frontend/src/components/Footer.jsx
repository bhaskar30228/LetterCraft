import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaHeart } from 'react-icons/fa';
import { RiMagicLine } from 'react-icons/ri';
import { IoMdSend } from 'react-icons/io';

const Footer = () => {
  const socialLinks = [
    { icon: <FaTwitter />, color: "#1DA1F2", name: "Twitter" },
    { icon: <FaInstagram />, color: "#E1306C", name: "Instagram" },
    { icon: <FaLinkedin />, color: "#0077B5", name: "LinkedIn" },
    { icon: <FaGithub />, color: "#333", name: "GitHub" }
  ];

  const templateLinks = [
    "Love Letters", "Cover Letters", "Business Letters", 
    "Apology Letters", "Resignation Letters"
  ];

  const companyLinks = [
    "About Us", "Careers", "Blog", "Press", "Partners"
  ];

  const supportLinks = [
    "Help Center", "Contact Us", "Privacy Policy", 
    "Terms of Service", "Cookie Policy"
  ];

  return (
    <footer className="footer">
      {/* Animated background elements */}
      <div className="footer-bg-elements">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="footer-bg-circle"
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
              '--pos-x': `${10 + i * 10}%`,
              '--pos-y': `${20 + (i % 3) * 20}%`,
              '--color': i % 2 === 0 ? 'rgba(108, 92, 231, 0.1)' : 'rgba(253, 121, 168, 0.1)'
            }}
          />
        ))}
      </div>

      <div className="footer-container">
        {/* Footer Top Section */}
        <div className="footer-top">
          <motion.div 
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.a 
              href="/" 
              className="footer-logo"
              whileHover={{ y: -3 }}
            >
              <motion.div 
                className="logo-icon-container"
                whileHover={{ rotate: 15, scale: 1.1 }}
              >
                <RiMagicLine className="logo-icon" />
                <div className="logo-sparkle"></div>
              </motion.div>
              <span>LetterCraft</span>
            </motion.a>
            
            <p className="footer-description">
              Create beautiful, professional documents in minutes with our easy-to-use templates.
            </p>
            
            <div className="social-links">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  aria-label={link.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -5,
                    color: link.color,
                    scale: 1.2
                  }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <div className="footer-links">
            <motion.div 
              className="link-column"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3>Templates</h3>
              <ul>
                {templateLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <a href="#">
                      <span className="link-arrow">→</span>
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              className="link-column"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3>Company</h3>
              <ul>
                {companyLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <a href="#">
                      <span className="link-arrow">→</span>
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              className="link-column"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <h3>Support</h3>
              <ul>
                {supportLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <a href="#">
                      <span className="link-arrow">→</span>
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="footer-bottom">
          <motion.div 
            className="newsletter"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Stay Updated</h3>
            <motion.form 
              className="newsletter-form"
              whileHover={{ scale: 1.02 }}
            >
              <input 
                type="email" 
                placeholder="Your email address" 
                required 
              />
              <motion.button 
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoMdSend className="send-icon" />
              </motion.button>
            </motion.form>
          </motion.div>

          <motion.div 
            className="copyright"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <p>
              © {new Date().getFullYear()} LetterCraft. Made with 
              <FaHeart className="heart-icon" /> by our team.
            </p>
            <div className="legal-links">
              <a href="#">Privacy Policy</a>
              <span>•</span>
              <a href="#">Terms of Service</a>
              <span>•</span>
              <a href="#">Cookies</a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;