import React from 'react';
import { Form } from 'react-bootstrap';
import './Steps.css';

const Step9 = ({ formData, handleSelectChange }) => {
  return (
    <div className="form-container">
      <h2>Lifestyle and Habits</h2>
      
      <Form.Group>
        <Form.Label>Do you exercise regularly?</Form.Label>
        <Form.Control
          as="select"
          name="lifestyle.exercise"
          value={formData.lifestyle.exercise}
          onChange={handleSelectChange}
        >
          <option value="">Select</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="rarely">Rarely</option>
          <option value="never">Never</option>
        </Form.Control>
      </Form.Group>
      
      <Form.Group>
        <Form.Label>Do you smoke?</Form.Label>
        <Form.Control
          as="select"
          name="lifestyle.smoke"
          value={formData.lifestyle.smoke}
          onChange={handleSelectChange}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="quit">Used to but quit</option>
        </Form.Control>
      </Form.Group>
      
      <Form.Group>
        <Form.Label>Do you consume alcohol?</Form.Label>
        <Form.Control
          as="select"
          name="lifestyle.alcohol"
          value={formData.lifestyle.alcohol}
          onChange={handleSelectChange}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="occasionally">Occasionally</option>
        </Form.Control>
      </Form.Group>
      
      <Form.Group>
        <Form.Label>Diet type:</Form.Label>
        <Form.Control
          as="select"
          name="lifestyle.diet"
          value={formData.lifestyle.diet}
          onChange={handleSelectChange}
        >
          <option value="">Select</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="non-vegetarian">Non-vegetarian</option>
          <option value="vegan">Vegan</option>
          <option value="other">Other</option>
        </Form.Control>
      </Form.Group>
      
    </div>
  );
};

export default Step9;

