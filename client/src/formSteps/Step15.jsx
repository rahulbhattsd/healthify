import React from 'react';
import { Button } from 'react-bootstrap';
import './Steps.css';

const Step15 = ({ formData, handleSubmit }) => {
  return (
    <div className="container">
      <h2>Review Your Responses</h2>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
      <Button variant="success" onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default Step15;

