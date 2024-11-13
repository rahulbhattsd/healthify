import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (localStorage.getItem('token')) {
      navigate('/form'); // Redirect to form if logged in
    } else {
      navigate('/login'); // Redirect to login/signup if not logged in
    }
  };
 const handelLernMore=()=>{
  navigate('/about');
 } 

  return (
    <div className="home full-screen">
      <section className="hero-section">
        <Container className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="hero-title">Welcome to Healthify</h1>
            <p className="hero-subtitle">Your personal health assistant powered by AI</p>
            <div className="hero-buttons">
              <Button variant="primary" className="hero-btn" onClick={handleGetStarted}>
                Get Started
              </Button>
              <Button variant="outline-secondary" className="hero-btn" onClick={handelLernMore}>Learn More</Button>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Home;





