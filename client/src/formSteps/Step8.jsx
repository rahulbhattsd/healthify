import React from 'react';
import { Form, Button } from 'react-bootstrap';
import './Steps.css';

const Step8 = ({ formData, handleSelectChange }) => {
  return (
    <div className="container">
      <h2>Current Symptoms</h2>

      {/* Textarea for describing symptoms */}
      <Form.Group>
        <Form.Label htmlFor="symptoms">Describe your symptoms</Form.Label>
        <Form.Control
          as="textarea"
          id="symptoms"
          name="symptoms"
          value={formData.symptoms}
          placeholder="Describe your symptoms"
          onChange={handleSelectChange}
        />
      </Form.Group>

      {/* Checkboxes for selecting common symptoms */}
      <p>Select any common symptoms:</p>
      <Form.Group>
        <Form.Check
          type="checkbox"
          label="Fatigue"
          name="fatigue"
          checked={formData.fatigue}
          onChange={handleSelectChange}
        />
        <Form.Check
          type="checkbox"
          label="Fever"
          name="fever"
          checked={formData.fever}
          onChange={handleSelectChange}
        />
        <Form.Check
          type="checkbox"
          label="Pain"
          name="pain"
          checked={formData.pain}
          onChange={handleSelectChange}
        />
        <Form.Check
          type="checkbox"
          label="Shortness of Breath"
          name="shortnessOfBreath"
          checked={formData.shortnessOfBreath}
          onChange={handleSelectChange}
        />
        <Form.Check
          type="checkbox"
          label="Nausea"
          name="nausea"
          checked={formData.nausea}
          onChange={handleSelectChange}
        />
        <Form.Check
          type="checkbox"
          label="Dizziness"
          name="dizziness"
          checked={formData.dizziness}
          onChange={handleSelectChange}
        />
      </Form.Group>

      {/* Input for other symptoms */}
      <Form.Group>
        <Form.Control
          type="text"
          className="mt-3"
          name="otherSymptoms"
          placeholder="Other symptoms"
          value={formData.otherSymptoms}
          onChange={handleSelectChange}
        />
      </Form.Group>
    </div>
  );
};

export default Step8;


