import React from 'react';
import { Button } from 'react-bootstrap';
import './Step15.css';

const Step15 = ({ formData, handleSubmit }) => {
  return (
    <div className="container">
      <h2>Review Your Responses</h2>
      <div className="response-card">
        <h3>Personal Information</h3>
        <ul>
          <li><strong>Age:</strong> {formData.age}</li>
          <li><strong>Height:</strong> {formData.height} cm</li>
          <li><strong>Ethnic Group:</strong> {formData.ethnicGroup}</li>
          <li><strong>Sex Assigned at Birth:</strong> {formData.sexAssignedAtBirth}</li>
        </ul>

        <h3>Lifestyle</h3>
        <ul>
          <li><strong>Exercise Frequency:</strong> {formData.lifestyle.exercise}</li>
          <li><strong>Smoke:</strong> {formData.lifestyle.smoke}</li>
          <li><strong>Alcohol Consumption:</strong> {formData.lifestyle.alcohol}</li>
          <li><strong>Diet:</strong> {formData.lifestyle.diet}</li>
        </ul>

        <h3>Allergies</h3>
        <ul>
          <li><strong>Medications:</strong> {formData.allergies.medications}</li>
          <li><strong>Foods:</strong> {formData.allergies.foods}</li>
          <li><strong>Environment:</strong> {formData.allergies.environment}</li>
          <li><strong>Others:</strong> {formData.allergies.others}</li>
        </ul>

        <h3>Health Conditions</h3>
        <ul>
          <li><strong>Chronic Conditions:</strong> {formData.chronicConditions}</li>
          <li><strong>Heart Health:</strong> {formData.familyHistory.heartDisease}</li>
          <li><strong>Diabetes:</strong> {formData.familyHistory.diabetes}</li>
        </ul>

        <h3>Health Symptoms</h3>
        <ul>
          <li><strong>Fatigue:</strong> {formData.fatigue ? "Yes" : "No"}</li>
          <li><strong>Fever:</strong> {formData.fever}</li>
          <li><strong>Pain:</strong> {formData.pain}</li>
          <li><strong>Shortness of Breath:</strong> {formData.shortnessOfBreath}</li>
          <li><strong>Nausea:</strong> {formData.nausea}</li>
        </ul>
      </div>  
    </div>
  );
};

export default Step15;

