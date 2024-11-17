import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './Steps.css';

const Step12 = ({ formData, handleSelectChange, onNext }) => {
  // Ensure medicalSupervision is defined before accessing its properties
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
      <Form.Group>
        <Form.Label>If yes, please specify the condition:</Form.Label>
        <Form.Control
          type="text"
          name="healthGoals.medicalSupervision.supervisionCondition"
          value={medicalSupervision.supervisionCondition || ''}
          onChange={handleSelectChange}
          placeholder="Condition being supervised"
        />
      </Form.Group>
      <Button variant="primary" onClick={onNext}>Next</Button>
    </div>
  );
};

export default Step12;


