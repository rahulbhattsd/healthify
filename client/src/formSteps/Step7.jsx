import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './Steps.css';

const Step7 = ({ formData, handleSelectChange }) => {
  const handleSubmit = () => {
    // Add validation checks if necessary
    handleNextStep();
  };

  return (
    <div className="container">
      <h2>Lifestyle and Activity Level</h2>
      <p>To further understand your health needs, please answer the following questions about your daily habits and activity level.</p>

      {/* Exercise Habits */}
      <h4>Exercise Habits</h4>
      <p>How frequently do you engage in physical exercise?</p>
      <Form.Group>
        <Form.Label>Exercise Frequency</Form.Label>
        <Form.Control
          as="select"
          name="exerciseFrequency"
          value={formData.exerciseFrequency}
          onChange={handleSelectChange}
        >
          <option value="daily">Daily</option>
          <option value="severalTimesAWeek">Several times a week</option>
          <option value="onceAWeek">Once a week</option>
          <option value="rarely">Rarely</option>
        </Form.Control>
      </Form.Group>

      {/* Stress Levels */}
      <h4>Stress Levels</h4>
      <p>How would you describe your current stress levels?</p>
      <Form.Group>
        <Form.Label>Stress Level</Form.Label>
        <Form.Control
          as="select"
          name="stressLevel"
          value={formData.stressLevel}
          onChange={handleSelectChange}
        >
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </Form.Control>
      </Form.Group>

      {/* Hydration */}
      <h4>Hydration</h4>
      <p>How much water do you typically drink per day?</p>
      <Form.Group>
        <Form.Label>Hydration</Form.Label>
        <Form.Control
          as="select"
          name="hydration"
          value={formData.hydration}
          onChange={handleSelectChange}
        >
          <option value="lessThanOneLiter">Less than 1 liter</option>
          <option value="oneToTwoLiters">1-2 liters</option>
          <option value="moreThanTwoLiters">More than 2 liters</option>
        </Form.Control>
      </Form.Group>

    </div>
  );
};

export default Step7;



