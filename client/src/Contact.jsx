import React from 'react';
import './Contact.css';

const Contact = () => {
  const handleCallClick = () => {
    alert('Calling Rahul Bhatt...');
  };

  return (
    <div className="contact-section-container">
      <div className="contact-section">
        <h1>Contact Us</h1>
        <p className="tagline">Get in touch with us for more information about Healthify and AI-powered health recommendations.</p>

        {/* Rahul Bhatt's Circular Contact Card */}
        <div className="contact-card" onClick={handleCallClick}>
          <div className="contact-card-circle">
            <h3>Rahul Bhatt</h3>
            <p><strong>CEO</strong></p>
            <p>Email: <a href="mailto:rahul.bhatt@aihealthify.com">rahul.bhatt@aihealthify.com</a></p>
            <p>Phone: <span className="phone-number" onClick={handleCallClick}>+91 98765 43210</span></p>
            <p>Location: Bengaluru, Karnataka</p>
          </div>
        </div>

        {/* Company Details Circular Section */}
        <div className="company-details-card">
          <div className="company-card-circle">
          <h4>Healthify AI</h4>
            <p>Transforming healthcare through AI-driven personalized solutions.</p>
            <p>Contact: info@healthify.ai</p>
            <p>Phone: +91 12345 67890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;




