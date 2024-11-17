import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import './Steps.css';
const Step3 = ({ formData , handleSelectChange}) => (
  <Container className="form-container">
    <h2>Sex Assigned at Birth</h2>
    <p>Biological sex can impact risk for certain conditions and response to treatments.</p>
    <Form.Group>
              <Form.Label>Sex Assigned at Birth</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="Male"
                  name="sexAssignedAtBirth"
                  value="male"
                  checked={formData.sexAssignedAtBirth === 'male'}
                  onChange={handleSelectChange}
                />
                <Form.Check
                  type="radio"
                  label="Female"
                  name="sexAssignedAtBirth"
                  value="female"
                  checked={formData.sexAssignedAtBirth === 'female'}
                  onChange={handleSelectChange}
                />
                <Form.Check
                  type="radio"
                  label="Other"
                  name="sexAssignedAtBirth"
                  value="other"
                  checked={formData.sexAssignedAtBirth === 'other'}
                  onChange={handleSelectChange}
                />
              </div>
            </Form.Group>

  </Container>
);

export default Step3;
