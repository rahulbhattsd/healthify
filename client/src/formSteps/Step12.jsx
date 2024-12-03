import React from 'react';
import { Form } from 'react-bootstrap';
import './Steps.css';

const Step12 = ({ formData, handleChange, handleSelectChange }) => {
  const medicalSupervision = formData.healthGoals?.medicalSupervision || {};

  return (
    <div className="container">
      <h2>Medical Supervision</h2>
      <Form.Group>
        <Form.Label>Are you currently under the supervision of a healthcare provider?</Form.Label>
        <Form.Control
          as="select"
          name="healthGoals.medicalSupervision.underSupervision"
          value={medicalSupervision.underSupervision || ''}
          onChange={handleSelectChange}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </Form.Control>
      </Form.Group>
      
    </div>
  );
};

export default Step12;
