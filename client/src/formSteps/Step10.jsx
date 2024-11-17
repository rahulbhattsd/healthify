import React from 'react';
import { Form } from 'react-bootstrap';
import './Steps.css';

const Step10 = ({ formData, handleSelectChange }) => {
  return (
    <div className="container">
      <h2>Allergies and Sensitivities</h2>
      <Form.Group>
        <Form.Label>Allergies to medications:</Form.Label>
        <Form.Control
          as="select"
          name="allergies.medications"
          value={formData.allergies.medications}
          onChange={handleSelectChange}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </Form.Control>
      </Form.Group>
      
      <Form.Group>
        <Form.Label>Food allergies:</Form.Label>
        <Form.Control
          as="select"
          name="allergies.foods"
          value={formData.allergies.foods}
          onChange={handleSelectChange}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Environmental allergies:</Form.Label>
        <Form.Control
          as="select"
          name="allergies.environment"
          value={formData.allergies.environment}
          onChange={handleSelectChange}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Other allergies:</Form.Label>
        <Form.Control
          as="select"
          name="allergies.others"
          value={formData.allergies.others}
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

export default Step10;

