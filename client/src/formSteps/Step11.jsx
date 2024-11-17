import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './Steps.css';

const Step11 = ({ formData, handleSelectChange }) => {
  return (
    <div className="container">
      <h2>Health Goals</h2>
      <Form.Group>
        <Form.Label>What is your primary health goal?</Form.Label>
        <Form.Control
          as="select"
          name="healthGoals.primaryGoal"  
          value={formData.healthGoals.primaryGoal}
          onChange={handleSelectChange}
        >
          <option value="">Select</option>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="general_health">General Health</option>
          <option value="mental_wellbeing">Mental Wellbeing</option>
          <option value="improve_stamina">Improve Stamina</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Secondary Health Goal</Form.Label>
        <Form.Control
          as="select"
          name="healthGoals.secondaryGoal" 
          value={formData.healthGoals.secondaryGoal}
          onChange={handleSelectChange}
        >
          <option value="">Select</option>
          <option value="stress_reduction">Stress Reduction</option>
          <option value="better_sleep">Better Sleep</option>
          <option value="improve_digestion">Improve Digestion</option>
          <option value="skin_health">Skin Health</option>
        </Form.Control>
      </Form.Group>
    </div>
  );
};

export default Step11;


