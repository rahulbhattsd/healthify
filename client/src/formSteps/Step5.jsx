// Step5.js
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './Steps.css';

const Step5 = ({ formData,handleSelectChange }) => {
  return (
    <div className="container">
      <h2>Medical History</h2>
      <h3>Chronic and Past Health Conditions</h3>
      <p>Include any chronic conditions or medical issues experienced. Essential for understanding health history and personalized care.</p>
      <Form.Group>
        <Form.Check
          type="checkbox"
          label="Yes, I have chronic conditions or medical issues"
          name="chronicConditions"
          checked={formData.chronicConditions}
          onChange={handleSelectChange}
        />
        <Form.Check
          type="checkbox"
          label="No, I do not have chronic conditions"
          name="noChronicConditions"
          checked={formData.noChronicConditions}
          onChange={handleSelectChange}
         />
      </Form.Group>

    </div>
  );
};

export default Step5;


