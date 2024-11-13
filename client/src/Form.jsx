import React, { useState } from 'react';
import { Container, Form, Button, ProgressBar } from 'react-bootstrap';
import './Form.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomForm = () => {
  const [step, setStep] = useState(9);
  const [formData, setFormData] = useState({
    symptoms: '',
    lifestyle: {
      exercise: '',
      smoke: '',
      alcohol: '',
      diet: '',
    },
    allergies: {
      medications: '',
      foods: '',
      environment: '',
      others: '',
    },
    familyHistory: {
      selectedConditions: [],
      heartDisease: '',
      bloodPressure: '',
      diabetes: '',
      cancer: '',
      asthma: '',
      mentalHealth: '',
      others: '',
    },
    medications: '',
    sleep: {
      hours: '',
      troubleSleeping: '',
      rested: '',
      comments: '',
    },
    mentalHealth: {
      stressLevel: '',
      anxiety: '',
      depression: '',
      comments: '',
    },
    surgeries: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else   
 if (type === 'select-multiple') {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
      setFormData((prevData) => ({
        ...prevData,   

        familyHistory: {
          ...prevData.familyHistory,
          selectedConditions: selectedOptions,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleNextStep = () => {
    if (step < 15) setStep(step + 1);
  };

  const progressPercentage = (step - 8) * 100 / 7; // Calculates progress based on the step number

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setFormData((prevData) => ({ ...prevData, [event.target.name]: selectedValue }));
  };

  return (
    <div className="form-container">
      <h1>Welcome to Healthify</h1>
      <p>Your personal health companion</p>

      <Container className="mt-5">
        <h2>Health Assessment</h2>
        <ProgressBar now={progressPercentage} label={`${Math.round(progressPercentage)}%`} className="my-3" />
        {step === 1 && (
          <div className="container">
            <h2>Hi, I’m your AI Doctor</h2>
            <p>We’re going to ask you some health-related questions to personalize your health journey for your unique needs.</p>
            <p><strong>Privacy Note:</strong> Your data is confidential and secured by HIPAA and GDPR standards.</p>
            <button className="btn btn-primary" onClick={handleNextStep}>Start</button>
          </div>
        )}

        {/* Step 2 - General Information */}
        {step === 2 && (
          <div className="container">
            <h2>General Information</h2>
            <h3>Primary Racial or Ethnic Group</h3>
            <p>Different racial and ethnic groups have varied health tendencies. We use this information to provide more accurate health recommendations.</p>
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
            <button className="btn btn-primary mt-3" onClick={handleNextStep} disabled={!formData.ethnicGroup}>Next</button>
          </div>
        )}

        {/* Step 3 - Sex Assigned at Birth */}
        {step === 3 && (
          <div className="container">
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
                  onChange={handleInputChange}
                />
                <Form.Check
                  type="radio"
                  label="Female"
                  name="sexAssignedAtBirth"
                  value="female"
                  checked={formData.sexAssignedAtBirth === 'female'}
                  onChange={handleInputChange}
                />
                <Form.Check
                  type="radio"
                  label="Other"
                  name="sexAssignedAtBirth"
                  value="other"
                  checked={formData.sexAssignedAtBirth === 'other'}
                  onChange={handleInputChange}
                />
              </div>
            </Form.Group>
            <button className="btn btn-primary mt-3" onClick={handleNextStep} disabled={!formData.sexAssignedAtBirth}>Next</button>
          </div>
        )}

        {/* Step 4 - Confirmation */}
        {step === 4 && (
          <div className="container">
            <h2>Great, Your General Information is Set!</h2>
            <p>Which Docus AI feature would you like to explore first?</p>
            <button className="btn btn-outline-primary mr-2" onClick={handleNextStep}>Personal AI Doctor</button>
            <button className="btn btn-outline-primary mr-2" onClick={handleNextStep}>Lab Test Interpretation</button>
            <button className="btn btn-outline-primary mr-2" onClick={handleNextStep}>Personalized Supplements</button>
            <button className="btn btn-outline-primary" onClick={handleNextStep}>Consultation with Top Doctors</button>
          </div>
        )}

        {/* Step 5 - Medical History */}
        {step === 5 && (
          <div className="container">
            <h2>Medical History</h2>
            <h3>Chronic and Past Health Conditions</h3>
            <p>Include any chronic conditions or medical issues experienced. Essential for understanding health history and personalized care.</p>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Yes, I have chronic conditions or medical issues"
                name="chronicConditions"
                checked={formData.chronicConditions}
                onChange={handleInputChange}
              />
            </Form.Group>
            <button className="btn btn-primary mt-3" onClick={handleNextStep} disabled={!formData.chronicConditions}>Next</button>
          </div>
        )}

        {/* Step 6 - Supplements Checkup */}
        {step === 6 && (
          <div className="container">
            <h2>Supplements Checkup</h2>
            <p>Personalized supplements for your needs</p>
            <button className="btn btn-outline-primary mr-2" onClick={handleNextStep}>Complete the checkup quiz</button>
            <button className="btn btn-outline-primary mr-2" onClick={handleNextStep}>Receive your supplement report with insights</button>
            <button className="btn btn-outline-primary" onClick={handleNextStep}>Get a Supplement Kit tailored to your health needs</button>
          </div>
        )}

        {/* Final Confirmation */}
        {step === 7 && (
          <div className="container">
            <h2>Thank You for Completing Your Health Journey!</h2>
            <p>We are processing your information and will be in touch with tailored recommendations soon.</p>
          </div>
        )}

        {/* Step 8 - Current Symptoms */}
        {step === 8 && (
          <div className="container">
            <h2>Current Symptoms</h2>
            <Form.Group>
              <Form.Label htmlFor="symptoms">Describe your symptoms</Form.Label>
              <Form.Control
                as="textarea"
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                placeholder="Describe your symptoms"
                onChange={handleInputChange}
              />
            </Form.Group>
            <p>Select any common symptoms:</p>
    <Form.Group>
      <Form.Check type="checkbox" label="Fatigue" name="fatigue" onChange={handleInputChange} />
      <Form.Check type="checkbox" label="Fever" name="fever" onChange={handleInputChange} />
      <Form.Check type="checkbox" label="Pain" name="pain" onChange={handleInputChange} />
      <Form.Check type="checkbox" label="Shortness of Breath" name="shortnessOfBreath" onChange={handleInputChange} />
      <Form.Check type="checkbox" label="Nausea" name="nausea" onChange={handleInputChange} />
      <Form.Check type="checkbox" label="Dizziness" name="dizziness" onChange={handleInputChange} />
      <Form.Control type="text" className="mt-3" name="otherSymptoms" placeholder="Other symptoms" onChange={handleInputChange} />
    </Form.Group>
    <button className="btn btn-primary mt-3" onClick={handleNextStep}>Next</button>
  </div>
)}

        {/* Step 9 */}
        {step === 9 && (
          <div>
            <h2>Lifestyle and Habits</h2>
            <Form.Group>
              <Form.Label>Do you exercise regularly?</Form.Label>
              <Form.Control as="select" name="exercise" value={formData.lifestyle.exercise} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="rarely">Rarely</option>
                <option value="never">Never</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Do you smoke?</Form.Label>
              <Form.Control as="select" name="smoke" value={formData.lifestyle.smoke} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="quit">Used to but quit</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Do you consume alcohol?</Form.Label>
              <Form.Control as="select" name="alcohol" value={formData.lifestyle.alcohol} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="occasionally">Occasionally</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Diet type:</Form.Label>
              <Form.Control as="select" name="diet" value={formData.lifestyle.diet} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="other">Other</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleNextStep}>Next</Button>
          </div>
        )}

        {/* Step 10 */}
        {step === 10 && (
          <div>
            <h2>Allergies and Sensitivities</h2>
            <Form.Group>
              <Form.Label>Allergies to medications:</Form.Label>
              <Form.Control as="select" name="medications" value={formData.allergies.medications} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Food allergies:</Form.Label>
              <Form.Control as="select" name="foods" value={formData.allergies.foods} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Environmental allergies:</Form.Label>
              <Form.Control as="select" name="environment" value={formData.allergies.environment} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Other sensitivities:</Form.Label>
              <Form.Control as="text" name="others" value={formData.allergies.others} onChange={handleInputChange} />
            </Form.Group>
            <Button variant="primary" onClick={handleNextStep}>Next</Button>
          </div>
        )}

               {/* Step 11 */}
               {step === 11 && (
          <div className="step-container">
            <h2 className="mb-4">Family Health History</h2>

            <Form.Group controlId="familyHistory">
              <Form.Label>Select family health conditions:</Form.Label>
              <Form.Control
                as="select"
                multiple
                name="familyHistory"
                value={formData.familyHistory.selectedConditions}
                onChange={handleInputChange}
              >
                <option value="heartDisease">Heart Disease</option>
                <option value="bloodPressure">High Blood Pressure</option>
                <option value="diabetes">Diabetes</option>
                <option value="cancer">Cancer</option>
                <option value="asthma">Asthma</option>
                <option value="mentalHealth">Mental Health Disorders</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="others">
              <Form.Label>Other family conditions:</Form.Label>
              <Form.Control
                as="textarea"
                name="others"
                value={formData.familyHistory.others}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleNextStep}>Next</Button>
          </div>
        )}

        {/* Step 12 */}
        {step === 12 && (
          <div>
            <h2>Current Medications and Supplements</h2>
            <Form.Group controlId="medications">
              <Form.Label>List current medications:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="medications"
                value={formData.medications}
                onChange={handleInputChange}
                placeholder="E.g., Aspirin, Vitamin D"
              />
            </Form.Group>
            <Button variant="primary" onClick={handleNextStep}>Next</Button>
          </div>
        )}

        {/* Step 13 */}
        {step === 13 && (
          <div className="step-container">
            <h2>Sleep Patterns and Quality</h2>
            <Form.Group controlId="hours">
              <Form.Label>Hours of sleep per night:</Form.Label>
              <Form.Control
                as="select"
                name="hours"
                value={formData.sleep.hours}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="<5">&lt;5</option>
                <option value="5-6">5-6</option>
                <option value="7-8">7-8</option>
                <option value="9+">9+</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Trouble falling asleep:</Form.Label>
              <Form.Control as="select" name="troubleSleeping" value={formData.sleep.troubleSleeping} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Do you feel rested?</Form.Label>
              <Form.Control as="select" name="rested" value={formData.sleep.rested} onChange={handleInputChange}>
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Additional comments:</Form.Label>
              <Form.Control as="textarea" name="comments" value={formData.sleep.comments} onChange={handleInputChange} />
            </Form.Group>

            <Button variant="primary" onClick={handleNextStep}>Next</Button>
          </div>
        )}


      </Container>
    </div>
  );
};

export default CustomForm;


