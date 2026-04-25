import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-section-container">
      <div className="contact-section">
        <h1>Contact Us</h1>
        <p className="tagline">
          Get in touch with us for more information about Healthify and AI-powered health recommendations.
        </p>

        {/* Rahul Bhatt Card */}
        <div className="contact-card">
          <div className="contact-card-circle">
            <h3>Rahul Bhatt</h3>
            <p><strong>Founder & Developer</strong></p>

            <p>
              Email:{' '}
              <a href="mailto:rahulbhatt.tech@gmail.com">
                rahulbhatt.tech@gmail.com
              </a>
            </p>

            <p>
              LinkedIn:{' '}
              <a
                href="https://www.linkedin.com/in/rahulbhatt-developer"
                target="_blank"
                rel="noopener noreferrer"
              >
                linkedin.com/in/rahulbhatt-developer
              </a>
            </p>

            <p>Location: Jabalpur, MP</p>
          </div>
        </div>

        {/* Company Details */}
        <div className="company-details-card">
          <div className="company-card-circle">
            <h4>Healthify AI</h4>
            <p>
              Transforming healthcare through AI-driven personalized solutions.
            </p>
            <p>Email: info@healthify.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;




