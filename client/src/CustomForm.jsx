import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CustomForm.css';

const SYMPTOM_OPTIONS = [
  'Fever',
  'Cough',
  'Sore throat',
  'Runny nose',
  'Headache',
  'Dizziness',
  'Fatigue',
  'Nausea',
  'Vomiting',
  'Diarrhea',
  'Shortness of breath',
  'Chest pain',
  'Body aches',
  'Loss of appetite',
  'Skin rash',
];

const INITIAL_FORM_STATE = {
  age: '',
  gender: '',
  weight: '',
  height: '',
  symptoms: [],
  additionalSymptoms: '',
  duration: '',
  preExistingConditions: '',
  allergies: '',
  currentMedications: '',
};

function readStoredFormData() {
  try {
    const savedForm = sessionStorage.getItem('healthify:last-form');
    if (!savedForm) {
      return INITIAL_FORM_STATE;
    }

    const parsed = JSON.parse(savedForm);
    return {
      ...INITIAL_FORM_STATE,
      ...parsed,
      symptoms: Array.isArray(parsed?.symptoms) ? parsed.symptoms : [],
    };
  } catch (error) {
    return INITIAL_FORM_STATE;
  }
}

function buildInitialState(locationFormData) {
  if (!locationFormData) {
    return readStoredFormData();
  }

  return {
    ...INITIAL_FORM_STATE,
    ...locationFormData,
    symptoms: Array.isArray(locationFormData.symptoms)
      ? locationFormData.symptoms
      : [],
  };
}

function validateForm(formData) {
  const nextErrors = {};
  const age = Number(formData.age);
  const weight = Number(formData.weight);
  const height = Number(formData.height);
  const hasSymptoms =
    formData.symptoms.length > 0 || Boolean(formData.additionalSymptoms.trim());

  if (!formData.age || Number.isNaN(age) || age <= 0 || age > 120) {
    nextErrors.age = 'Enter a valid age between 1 and 120.';
  }

  if (!formData.gender) {
    nextErrors.gender = 'Select a gender.';
  }

  if (!formData.weight || Number.isNaN(weight) || weight <= 0) {
    nextErrors.weight = 'Enter your weight in kilograms.';
  }

  if (!formData.height || Number.isNaN(height) || height <= 0) {
    nextErrors.height = 'Enter your height in centimeters.';
  }

  if (!hasSymptoms) {
    nextErrors.symptoms = 'Choose at least one symptom or describe it in the notes field.';
  }

  if (!formData.duration.trim()) {
    nextErrors.duration = 'Tell us how long the symptoms have been present.';
  }

  return nextErrors;
}

const CustomForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() =>
    buildInitialState(location.state?.formData),
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const symptomCount = formData.symptoms.length;

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setErrors((previous) => ({
      ...previous,
      [name]: '',
      ...(name === 'additionalSymptoms' ? { symptoms: '' } : {}),
    }));
  };

  const handleSymptomToggle = (symptom) => {
    setFormData((previous) => {
      const symptoms = previous.symptoms.includes(symptom)
        ? previous.symptoms.filter((item) => item !== symptom)
        : [...previous.symptoms, symptom];

      return {
        ...previous,
        symptoms,
      };
    });

    setErrors((previous) => ({
      ...previous,
      symptoms: '',
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    sessionStorage.setItem('healthify:last-form', JSON.stringify(formData));
    sessionStorage.removeItem('healthify:last-advice');

    navigate('/result', {
      state: { formData },
    });
  };

  return (
    <main className="health-form-page">
      <section className="health-form-shell">
        <div className="health-form-intro">
          <span className="eyebrow">Health Intake</span>
          <h1>Describe what you are feeling and let Healthify organize the next steps.</h1>
          <p>
            Share the basics below and the Groq-powered assistant will return a
            structured overview with self-care guidance, medicine cautions, and
            red flags.
          </p>

          <div className="trust-panel">
            <div>
              <strong>What you will get</strong>
              <p>Possible insights, home remedies, lifestyle ideas, OTC guidance, and when to seek medical help.</p>
            </div>
            <div>
              <strong>Important</strong>
              <p>Healthify is informational only and does not replace an in-person clinician.</p>
            </div>
          </div>
        </div>

        <form className="health-form-card" onSubmit={handleSubmit} noValidate>
          <div className="field-grid compact-grid">
            <label className="field-card">
              <span>Age</span>
              <input
                type="number"
                min="1"
                max="120"
                name="age"
                value={formData.age}
                onChange={handleFieldChange}
                placeholder="e.g. 29"
                aria-invalid={Boolean(errors.age)}
              />
              {errors.age ? <small className="inline-error">{errors.age}</small> : null}
            </label>

            <label className="field-card">
              <span>Gender</span>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleFieldChange}
                aria-invalid={Boolean(errors.gender)}
              >
                <option value="">Select</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender ? <small className="inline-error">{errors.gender}</small> : null}
            </label>

            <label className="field-card">
              <span>Weight (kg)</span>
              <input
                type="number"
                min="1"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleFieldChange}
                placeholder="e.g. 68"
                aria-invalid={Boolean(errors.weight)}
              />
              {errors.weight ? <small className="inline-error">{errors.weight}</small> : null}
            </label>

            <label className="field-card">
              <span>Height (cm)</span>
              <input
                type="number"
                min="1"
                step="0.1"
                name="height"
                value={formData.height}
                onChange={handleFieldChange}
                placeholder="e.g. 172"
                aria-invalid={Boolean(errors.height)}
              />
              {errors.height ? <small className="inline-error">{errors.height}</small> : null}
            </label>
          </div>

          <section className="form-section">
            <div className="section-heading">
              <h2>Symptoms</h2>
              <p>Select the closest matches. You can also add free-text notes.</p>
            </div>

            <div className="symptom-grid">
              {SYMPTOM_OPTIONS.map((symptom) => {
                const isSelected = formData.symptoms.includes(symptom);

                return (
                  <button
                    key={symptom}
                    type="button"
                    className={`symptom-chip${isSelected ? ' selected' : ''}`}
                    onClick={() => handleSymptomToggle(symptom)}
                    aria-pressed={isSelected}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>

            <div className="symptom-toolbar">
              <span className={`symptom-count${symptomCount > 0 ? ' active' : ''}`}>
                {symptomCount > 0
                  ? `${symptomCount} symptom${symptomCount > 1 ? 's' : ''} selected`
                  : 'No symptom chips selected yet'}
              </span>
              {symptomCount > 0 ? (
                <button
                  type="button"
                  className="clear-symptoms-button"
                  onClick={() => {
                    setFormData((previous) => ({
                      ...previous,
                      symptoms: [],
                    }));
                  }}
                >
                  Clear selection
                </button>
              ) : null}
            </div>

            <label className="field-card">
              <span>Additional symptom notes</span>
              <textarea
                name="additionalSymptoms"
                rows="4"
                value={formData.additionalSymptoms}
                onChange={handleFieldChange}
                placeholder="Describe symptoms, severity, timing, triggers, or anything unusual."
              />
            </label>

            {errors.symptoms ? <small className="inline-error block-error">{errors.symptoms}</small> : null}
          </section>

          <div className="field-grid">
            <label className="field-card">
              <span>How long have the symptoms been present?</span>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleFieldChange}
                placeholder="e.g. 2 days, 1 week, on and off for a month"
                aria-invalid={Boolean(errors.duration)}
              />
              {errors.duration ? <small className="inline-error">{errors.duration}</small> : null}
            </label>

            <label className="field-card">
              <span>Pre-existing conditions</span>
              <textarea
                name="preExistingConditions"
                rows="4"
                value={formData.preExistingConditions}
                onChange={handleFieldChange}
                placeholder="e.g. asthma, diabetes, hypertension. Write none if not applicable."
              />
            </label>

            <label className="field-card">
              <span>Allergies</span>
              <textarea
                name="allergies"
                rows="4"
                value={formData.allergies}
                onChange={handleFieldChange}
                placeholder="Food, medicine, seasonal, or environmental allergies."
              />
            </label>

            <label className="field-card">
              <span>Current medications</span>
              <textarea
                name="currentMedications"
                rows="4"
                value={formData.currentMedications}
                onChange={handleFieldChange}
                placeholder="List any medicines or supplements you are currently taking."
              />
            </label>
          </div>

          <div className="submit-row">
            <p className="submit-note">
              Healthify will send this information securely to Groq to generate advice.
            </p>
            <button className="primary-submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Preparing your results...' : 'Get health advice'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CustomForm;
