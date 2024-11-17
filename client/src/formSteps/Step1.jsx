import React from 'react';
import { Button, Container } from 'react-bootstrap';
import './Steps.css';

const Step1 = ({ }) => (
  <Container className="form-container">
    <h2>Hi, I’m your AI Doctor</h2>
    <p>We’re going to ask you some health-related questions to personalize your health journey for your unique needs.</p>
    <p><strong>Privacy Note:</strong> Your data is confidential and secured by HIPAA and GDPR standards.</p>

  </Container>
);

export default Step1;
