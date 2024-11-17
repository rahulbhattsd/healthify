import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './Steps.css';

const Step13 = ({ formData, handleSelectChange }) => {
  // Ensure medicationUse is defined before accessing its properties
  const medicationUse = formData.medicationUse || {};

  return (
    <div className="container">
      <h2>Medication Use</h2>
      <Form.Group>
        <Form.Label>Are you currently taking any medications?</Form.Label>
        <Form.Control
          as="select"
          name="medicationUse.currentlyTakingMedications"
          value={medicationUse.currentlyTakingMedications || ''}
          onChange={handleSelectChange}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>If yes, please list them:</Form.Label>
        <Form.Control
          type="text"
          name="medicationUse.medicationsList"
          value={medicationUse.medicationsList || ''}
          onChange={handleSelectChange}
          placeholder="List of medications"
        />
      </Form.Group>
    </div>
  );
};

export default Step13;

