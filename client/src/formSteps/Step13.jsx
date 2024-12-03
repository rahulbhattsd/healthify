import React from 'react';
import { Form } from 'react-bootstrap';
import './Steps.css';

const Step13 = ({ formData, handleChange, handleSelectChange }) => {
  const medicationUse = formData.healthGoals?.medicationUse || {};

  return (
    <div className="container">
      <h2>Medication Use</h2>

      <Form.Group>
        <Form.Label>Are you currently taking any medications?</Form.Label>
        <Form.Control
          as="select"
          name="healthGoals.medicationUse.currentlyTakingMedications"
          value={medicationUse.currentlyTakingMedications || ''}
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

export default Step13;
