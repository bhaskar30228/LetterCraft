import React, { useState, useEffect, useContext } from 'react';
import './Navbar.css';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';
import { CiLogin } from "react-icons/ci";
import { RiMagicLine } from 'react-icons/ri';
import { FaBolt } from 'react-icons/fa';
import SignPage from './SignPage';
import AuthContext from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { open, setOpen, isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [activeLink, setActiveLink] = useState('/');
  const [hoveredLink, setHoveredLink] = useState(null);

  // code to change the bg of navbar when we scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  const handleSign = () => {
    setOpen(true);
    setIsMenuOpen(false);
  };

  const handleClick = () => {
    isLoggedIn ? navigate('/templates') : setOpen(true);
    setActiveLink('/templates');
    setIsMenuOpen(false);
  };

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const isActive = (path) => {
    return activeLink === path;
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="navbar-container">
          {/* Logo with animated sparkle */}
          <div className="navbar-logo">
            <Link onClick={() => setActiveLink("/")} to="/">
              <div className="logo-sparkle">
                <RiMagicLine className="logo-icon" />
                <div className="sparkle-container">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="sparkle" style={{
                      '--delay': `${i * 0.1}s`,
                      '--angle': `${i * 72}deg`,
                      '--size': `${2 + i * 0.5}px`
                    }} />
                  ))}
                </div>
              </div>
              <span className="logo-text">LetterCraft</span>
              <div className="logo-underline"></div>
            </Link>
          </div>

          {/* Animated Mobile Menu Button */}
          <div className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <div className="menu-line top"></div>
            <div className="menu-line middle"></div>
            <div className="menu-line bottom"></div>
          </div>

          {/* Navigation Links with Floating Animation */}
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li 
              className="nav-item" 
              onMouseEnter={() => setHoveredLink('templates')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Link 
                onClick={handleClick}  
                className={`nav-link ${isActive("/templates") ? "active" : ""}`}
              >
                <span className="link-text">Templates</span>
                <span className="link-highlight"></span>
                {hoveredLink === 'templates' && <FaBolt className="link-icon" />}
              </Link>
            </li>
            <li 
              className="nav-item"
              onMouseEnter={() => setHoveredLink('about')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Link 
                onClick={() => {
                  setActiveLink("/about");
                  setIsMenuOpen(false);
                }} 
                to="/about" 
                className={`nav-link ${isActive("/about") ? "active" : ""}`}
              >
                <span className="link-text">About</span>
                <span className="link-highlight"></span>
                {hoveredLink === 'about' && <FaBolt className="link-icon" />}
              </Link>
            </li>
            <li 
              className="nav-item"
              onMouseEnter={() => setHoveredLink('contact')}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <Link 
                onClick={() => {
                  setActiveLink("/contact");
                  setIsMenuOpen(false);
                }} 
                to="/contact" 
                className={`nav-link ${isActive("/contact") ? "active" : ""}`}
              >
                <span className="link-text">Contact</span>
                <span className="link-highlight"></span>
                {hoveredLink === 'contact' && <FaBolt className="link-icon" />}
              </Link>
            </li>
            {isLoggedIn ? (
              <li 
                className="nav-item" 
                onClick={() => {
                  localStorage.removeItem("token");
                  setIsLoggedIn(false);
                  setIsMenuOpen(false);
                }}
                onMouseEnter={() => setHoveredLink('logout')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <div className="nav-link">
                  <span className="link-text">Logout</span>
                  <span className="link-highlight"></span>
                  <FiUser className="user-icon" />
                  {hoveredLink === 'logout' && <FaBolt className="link-icon" />}
                </div>
              </li>
            ) : (
              <li 
                className="nav-item" 
                onClick={handleSign}
                onMouseEnter={() => setHoveredLink('login')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <div className="nav-link">
                  <span className="link-text">Login</span>
                  <span className="link-highlight"></span>
                  <CiLogin className="login-icon" />
                  {hoveredLink === 'login' && <FaBolt className="link-icon" />}
                </div>
              </li>
            )}
          </ul>
        </div>
        
        {/* Animated background elements */}
        <div className="nav-bg-elements">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="bg-circle" 
              style={{
                '--size': `${3 + i * 0.5}rem`,
                '--delay': `${i * 0.05}s`,
                '--pos-x': `${10 + i * 10}%`,
                '--pos-y': `${20 + (i % 3) * 20}%`
              }} 
            />
          ))}
        </div>
      </nav>
      {open && <SignPage />}
    </>
  );
};

export default Navbar;