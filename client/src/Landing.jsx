import React, { useState, useEffect } from 'react';
import './Landing.css';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // const handleMouseMove = (e) => {
    //   setMousePosition({ x: e.clientX, y: e.clientY });
    // };

  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // 
  }, []
  );

  const handleStart = () => {
    navigate('/form');
  };
const handleLeAbout = () => {
  navigate('/about');
};

  const handleStartFree = () => {
    navigate('/form');
  };

  const FeatureCard = ({ icon, title, description, delay = 0 }) => (
    <div
      className="feature-card"
      style={{
        animationDelay: `${delay}ms`,
        transform: `translateY(${Math.sin(Date.now() / 1000 + delay) * 2}px)`
      }}
    >
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="feature-glow"></div>
    </div>
  );

  const StepCard = ({ number, text, delay = 0 }) => (
    <div
      className="step-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="step-number">{number}</div>
      <p>{text}</p>
    </div>
  );

  return (
    <div className="landing">
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="floating-shapes">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="shape"
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-gradient">Healthify</span>
              <div className="title-underline"></div>
            </h1>
            <p className="hero-subtitle">
              Transform your health journey with AI-powered insights and personalized recommendations
            </p>
            <div className="hero-buttons">
              <button className="hero-btn primary" onClick={handleStart}>
                <span>Start Your Journey</span>
                <div className="btn-glow"></div>
              </button>
              <button className="hero-btn secondary" onClick={handleLeAbout}>
                <span>Discover More</span>
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="health-dashboard">
              <div className="dashboard-card">
                <div className="pulse-indicator active"></div>
                <span>Heart Rate: 72 BPM</span>
              </div>
              <div className="dashboard-card">
                <div className="pulse-indicator"></div>
                <span>Steps: 8,432</span>
              </div>
              <div className="dashboard-card">
                <div className="pulse-indicator active"></div>
                <span>Sleep: 7.5h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Powered by Advanced AI</h2>
          <p>Experience the future of personal healthcare</p>
        </div>
        <div className="features-grid">
          <FeatureCard
            icon="🧠"
            title="AI Health Analysis"
            description="Advanced machine learning algorithms analyze your vitals and provide personalized health insights in real-time."
            delay={0}
          />
          <FeatureCard
            icon="🔒"
            title="Military-Grade Security"
            description="Your sensitive health data is protected with bank-level encryption and zero-knowledge architecture."
            delay={200}
          />
          <FeatureCard
            icon="⚡"
            title="24/7 Smart Assistant"
            description="Get instant answers, track progress, and receive proactive health recommendations anytime, anywhere."
            delay={400}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>Simple. Smart. Effective.</h2>
          <p>Get started in under 2 minutes</p>
        </div>
        <div className="steps-container">
          <StepCard
            number="01"
            text="Input your health parameters through our intuitive interface"
            delay={0}
          />
          <div className="step-connector"></div>
          <StepCard
            number="02"
            text="Our AI analyzes patterns and correlations in your data"
            delay={300}
          />
          <div className="step-connector"></div>
          <StepCard
            number="03"
            text="Receive personalized insights and actionable recommendations"
            delay={600}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5★</div>
            <div className="stat-label">User Rating</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to revolutionize your health?</h2>
          <p>Join thousands who've already transformed their wellness journey</p>
          <button className="cta-button" onClick={handleStartFree}>
            <span>Start Free Today</span>
            <div className="cta-glow"></div>
          </button>
        </div>
        <div className="cta-visual">
          <div className="success-metrics">
            <div className="metric">📈 Health Score: +42%</div>
            <div className="metric">💪 Fitness Level: Improved</div>
            <div className="metric">😴 Sleep Quality: Excellent</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
