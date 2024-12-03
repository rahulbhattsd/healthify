import React from 'react';
import { Button, Form } from 'react-bootstrap';
import './Steps.css';

const Step4 = ({ formData, handleSelectChange }) => {
  return (
    <div className="container">
      <h2>Great, Your General Information is Set!</h2>
      <p>Answer the next questions honestly and responsibly</p>

      <Form.Group controlId="age">
        <Form.Label>Age (years)</Form.Label>
        <Form.Control
          as="select"
          name="age"
          value={formData.age || ''}
          onChange={handleSelectChange}
        >
          <option value="">Select Age</option>
          {[...Array(101)].map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="height" className="mt-3">
        <Form.Label>Height (feet)</Form.Label>
        <Form.Control
          as="select"
          name="height"
          value={formData.height || ''}
          onChange={handleSelectChange}
        >
          <option value="">Select Height</option>
          {[...Array(8)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i}-{i + 1} ft
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="weight" className="mt-3">
        <Form.Label>Weight (kg)</Form.Label>
        <Form.Control
          as="select"
          name="weight"
          value={formData.weight || ''}
          onChange={handleSelectChange}
        >
          <option value="">Select Weight</option>
          {[...Array(201)].map((_, i) => (
            <option key={i} value={i + 30}>
              {i + 30} kg
            </option>
          ))}
        </Form.Control>
      </Form.Group>

 
    </div>
  );
};

export default Step4;


