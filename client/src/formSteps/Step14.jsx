import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './Steps.css';
const Step14 = ({ formData,handleSelectChange}) => {
  return (
    <div className="container">
      <h2>Symptoms Severity</h2>
      <Form.Group>
        <Form.Label>How would you rate the severity of your current symptoms?</Form.Label>
        <Form.Control
          as="select"
          name="symptomsSeverity"
          value={formData.symptomsSeverity}
          onChange={handleSelectChange}
        >
          <option value="">Select</option>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </Form.Control>
      </Form.Group>
      
    </div>
  );
};

export default Step14;

