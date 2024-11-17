import React from 'react';
import { Form } from 'react-bootstrap';
import './Steps.css';

const Step6 = ({ formData, handleSelectChange }) => {
  const handleSubmit = () => {
    if (!formData.chronicConditions) {
      alert('Please specify chronic conditions.');
      return;
    }
    handleNextStep();
  };

  return (
    <div className="container">
      <h2>Supplements Checkup</h2>
      <p>Based on your medical history, let's understand your supplement needs better.</p>

      {/* Chronic Conditions */}
      {formData.chronicConditions && (
        <div>
          <h4>Chronic Conditions</h4>
          <p>You mentioned having chronic health conditions. Please select any relevant areas for targeted supplements:</p>
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
      )}

      {/* Dietary Preferences */}
      <h4>Dietary Preferences</h4>
      <p>Please let us know if you have any dietary restrictions or preferences:</p>
      <Form.Group>
        <Form.Label>Dietary Preferences</Form.Label>
        <Form.Control as="select" name="dietaryPreferences" value={formData.dietaryPreferences} onChange={handleSelectChange} >
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="glutenFree">Gluten-Free</option>
        </Form.Control>
      </Form.Group>

      {/* Current Medications */}
      <h4>Current Medications</h4>
      <p>If you're taking any medications, please indicate below. This will help us avoid any possible interactions with supplements.</p>
      <Form.Group>
        <Form.Label>List of Current Medications</Form.Label>
        <Form.Control
          type="text"
          placeholder="List of current medications"
          name="currentMedications"
          value={formData.currentMedications}
          onChange={handleSelectChange}
        />
      </Form.Group>

      {/* Sleep & Energy Levels */}
      <h4>Sleep & Energy Levels</h4>
      <p>How would you rate your current sleep quality and daily energy levels?</p>
      <Form.Group>
        <Form.Label>Sleep & Energy Levels</Form.Label>
        <Form.Control as="select" name="sleepEnergy" value={formData.sleepEnergy} onChange={handleSelectChange}>
          <option value="">Select</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </Form.Control>
      </Form.Group>
    </div>
  );
};

export default Step6;
