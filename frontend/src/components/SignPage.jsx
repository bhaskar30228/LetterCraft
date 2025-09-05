import React, { useContext, useState, useEffect } from 'react';
import './SignPage.css';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const SignPage = () => {
  const navigate = useNavigate();
  const { open, setOpen, isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const endpoint = isLoginForm ? 'login' : 'signUp';
    const data= isLoginForm ? {
      email: formData.email, 
      password: formData.password
    } : {
      username: formData.name,
      email: formData.email,
      password: formData.password,
    };

    await axios.post(`http://localhost:5000/auth/${endpoint}`, data).
    then((response) => {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setOpen(false);
      setIsLoggedIn(true);
    }).catch((error) => {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');  
      console.error('Error during authentication:', error);
    }).finally(() => {
      setIsLoading(false);
    });
  }
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setFormData({ 
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setError('');
  };
  
  useEffect(() => {
    console.log('Authentication state changed:', isLoggedIn);
    
    // You can perform any action when isLoggedIn changes
    if (isLoggedIn) {
      // User is logged in - maybe close the sign-in popup
      setOpen(false);
      // Or redirect, etc.
    } else {
      // User logged out - maybe clear some state
    }
  }, [isLoggedIn]);
      
  return (
    <div className="sign-popup-overlay">
      <div className="sign-popup-container">
        <button className="close-btn" onClick={() => setOpen(false)}>×</button>
        
        <div className="sign-header">
          <h2>{isLoginForm ? 'Welcome Back!' : 'Join PDFMagic'}</h2>
          <p>{isLoginForm ? 'Log in to access your templates' : 'Create an account to save your work'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="sign-form">
          {!isLoginForm && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isLoginForm ? "Enter your password" : "Create a password"}
              required
              minLength="6"
            />
          </div>

          {!isLoginForm && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                minLength="6"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLoginForm ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="sign-footer">
          <p>
            {isLoginForm ? "Don't have an account? " : "Already have an account? "}
            <button 
              className="toggle-form-btn" 
              onClick={toggleForm}
              disabled={isLoading}
            >
              {isLoginForm ? 'Sign up' : 'Log in'}
            </button>
          </p>
          
          <div className="social-login">
            <p>Or continue with</p>
            <div className="social-icons">
              <button className="social-btn google">G</button>
              <button className="social-btn facebook">F</button>
              <button className="social-btn apple">A</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignPage;