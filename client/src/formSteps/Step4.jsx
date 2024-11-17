import React from 'react';
import { Button } from 'react-bootstrap';
import './Steps.css';

const Step4 = ({  handleSelectChange }) => {
  return (
    <div className="container">
      <h2>Great, Your General Information is Set!</h2>
         <p> Answer the next question honestly and responsibly</p>
      <Button 
        variant="outline-primary" 
        className="me-2" 
        onClick={handleSelectChange }
      >
        Personal AI Doctor
      </Button>
    </div>
  );
};

export default Step4;
