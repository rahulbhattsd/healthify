import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (localStorage.getItem('userLoggedIn') || localStorage.getItem('token')) {
      navigate('/form');
    } else {
      navigate('/login');
    }
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  return (
    <div className="home-wrapper">
      {/* HERO */}
      <section className="hero-section">
        <Container>
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              AI-Powered <span>Health Assistant</span>
            </h1>
            <p className="hero-subtitle">
              Analyze symptoms, get smart suggestions, and improve your health using AI.
            </p>

            <div className="hero-buttons">
              <Button className="btn-primary-custom" onClick={handleGetStarted}>
                Get Started
              </Button>
              <Button className="btn-outline-custom" onClick={handleLearnMore}>
                Learn More
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

     
    </div>
  );
};

export default Home;