import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import './Steps.css';

const Step8 = ({ formData, handleSelectChange, handleChange }) => {
  const [symptoms, setSymptoms] = useState(formData.symptoms || '');

  useEffect(() => {
    setSymptoms(formData.symptoms);
  }, [formData.symptoms]);

  const handleTextareaChange = (event) => {
    const { value } = event.target;
    setSymptoms(value);
    handleChange({ target: { name: 'symptoms', value } });
  };

  return (
    <div className="container">
      <h2>Current Symptoms</h2>

  

      {/* Checkboxes for selecting common symptoms */}
      <p>Select any common symptoms:</p>
      <Form.Group>
      <Form.Check type="checkbox" label="Fatigue" name="fatigue" checked={formData.fatigue} onChange={handleSelectChange} />
      <Form.Check type="checkbox" label="Fever" name="fever" checked={formData.fever} onChange={handleSelectChange} />
      <Form.Check type="checkbox" label="Pain" name="pain" checked={formData.pain} onChange={handleSelectChange} />
      <Form.Check type="checkbox" label="Shortness of Breath" name="shortnessOfBreath" checked={formData.shortnessOfBreath} onChange={handleSelectChange} />
      <Form.Check type="checkbox" label="Nausea" name="nausea" checked={formData.nausea} onChange={handleSelectChange} />
      <Form.Check type="checkbox" label="Dizziness" name="dizziness" checked={formData.dizziness} onChange={handleSelectChange} />
      <Form.Check type="checkbox" label="Headache" name="headache" checked={formData.headache} onChange={handleSelectChange} />
      <Form.Check type="checkbox" label="Cough" name="cough" checked={formData.cough} onChange={handleSelectChange} />
      <Form.Check type="checkbox" label="Sore Throat" name="soreThroat" checked={formData.soreThroat} onChange={handleSelectChange} />
      <Form.Check type="checkbox" label="Runny Nose" name="runnyNose" checked={formData.runnyNose} onChange={handleSelectChange} />
      <Form.Check type="checkbox" label="Muscle Ache" name="muscleAche" checked={formData.muscleAche} onChange={handleSelectChange} />
      <Form.Check type="checkbox" label="Loss of Appetite" name="lossOfAppetite" checked={formData.lossOfAppetite} onChange={handleSelectChange} />
      <Form.Check type="checkbox" label="Chest Pain" name="chestPain" checked={formData.chestPain} onChange={handleSelectChange} />
      </Form.Group>

  
    </div>
  );
};

export default Step8;
