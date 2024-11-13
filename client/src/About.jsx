import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="section about-section">
      <h1 className="animated fadeIn">About Us</h1>
      <p className="tagline animated fadeIn">Empowering your health with the power of AI</p>
      
      <p className="intro animated fadeInUp">
        At Healthify, we are dedicated to helping you make informed, personalized health decisions. Our AI-driven platform uses cutting-edge technology to provide tailored health and supplement recommendations based on your unique needs, lifestyle, and preferences.
      </p>

      <div className="about-grid animated fadeInUp">
        <div className="about-item">
          <h3>Personalized Advice</h3>
          <p>Get customized health suggestions that are scientifically backed, designed specifically for you.</p>
        </div>
        <div className="about-item">
          <h3>Holistic Health Approach</h3>
          <p>Our platform considers all aspects of your health—nutrition, supplements, and lifestyle choices.</p>
        </div>
        <div className="about-item">
          <h3>AI-Powered Insights</h3>
          <p>Our AI system constantly learns and improves, providing you with the most accurate and up-to-date recommendations.</p>
        </div>
      </div>

      <p className="mission-statement animated fadeInUp">
        Healthify is more than just an app; it's a health companion that grows with you. Whether you're aiming to improve your overall well-being or target specific health goals, we're here to support you every step of the way.
      </p>

      <p className="cta-text animated fadeInUp">Join us on the journey to better health and personalized wellness today.</p>
      <a href="/signup" className="about-cta-button animated bounceInUp">Get Started</a>
    </div>
  );
};

export default About;




