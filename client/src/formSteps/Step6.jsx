import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import './Steps.css';

const Step6 = ({ formData, handleSelectChange, handleChange }) => {
  const [currentMedications, setCurrentMedications] = useState(formData.currentMedications || '');

  useEffect(() => {
    setCurrentMedications(formData.currentMedications);
  }, [formData.currentMedications]);

  const handleTextareaChange = (event) => {
    const { value } = event.target;
    setCurrentMedications(value);
    handleChange({ target: { name: 'currentMedications', value } });
  };

  return (
    <div className="container">
      <h2>Supplements Checkup</h2>
      <p>Based on your medical history, let's understand your supplement needs better.</p>

      {/* Chronic Conditions */}
      <Form.Group>
        <Form.Label>Chronic Conditions</Form.Label>
        <Form.Control as="select" name="chronicConditions" value={formData.chronicConditions} onChange={handleSelectChange}>
          <option value="">Select</option>
          <option value="heartHealth">Heart Health Support</option>
          <option value="boneJointSupport">Bone & Joint Support</option>
          <option value="immuneSupport">Immune System Boost</option>
        </Form.Control>
      </Form.Group>

     
    </div>
  );
};

export default Step6;

