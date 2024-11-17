import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import './Steps.css';
const Step2 = ({ formData, handleSelectChange }) => (
  <Container className="form-container">
    <h2>General Information</h2>
    <h3>Primary Racial or Ethnic Group</h3>
    <p>Different racial and ethnic groups have varied health tendencies.</p>
    <Form.Group>
      <Form.Label htmlFor="ethnicGroup">Select your ethnic group</Form.Label>
      <Form.Control
        as="select"
        id="ethnicGroup"
        name="ethnicGroup"
        value={formData.ethnicGroup}
       onChange={handleSelectChange}
      >
        <option value="">Select</option>
        <option value="asian">Asian</option>
        <option value="black">Black or African American</option>
        <option value="caucasian">Caucasian</option>
        <option value="hispanic">Hispanic or Latino</option>
        <option value="other">Other</option>
      </Form.Control>
    </Form.Group>

  </Container>
);

export default Step2;
