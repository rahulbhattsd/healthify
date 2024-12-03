import React, { useState } from 'react';
import { ProgressBar, Button } from 'react-bootstrap';
import Step1 from './formSteps/Step1';
import Step2 from './formSteps/Step2';
import Step3 from './formSteps/Step3';
import Step4 from './formSteps/Step4';
import Step5 from './formSteps/Step5';
import Step6 from './formSteps/Step6';
import Step7 from './formSteps/Step7';
import Step8 from './formSteps/Step8';
import Step9 from './formSteps/Step9';
import Step10 from './formSteps/Step10';
import Step11 from './formSteps/Step11';
import Step12 from './formSteps/Step12';
import Step13 from './formSteps/Step13';
import Step14 from './formSteps/Step14';
import Step15 from './formSteps/Step15';
import './CustomForm.css';
const CustomForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ethnicGroup: '',
    sexAssignedAtBirth: '',
    lifestyle: { exercise: '', smoke: '', alcohol: '', diet: '' },
    allergies: { medications: '', foods: '', environment: '', others: '' },
    familyHistory: { 
      selectedConditions: [], 
      heartDisease: '', 
      bloodPressure: '', 
      diabetes: '', 
      cancer: '', 
      asthma: '', 
      mentalHealth: '', 
      others: '' 
    },
    medications: '',
    sleep: { hours: '', troubleSleeping: '', rested: '', comments: '' },
    mentalHealth: { stressLevel: '', anxiety: '', depression: '', comments: '' },
    surgeries: '',
    healthGoals: {
      primaryGoal: '',
      secondaryGoal: '',
      medicalSupervision: {
        underSupervision: '',
        supervisionCondition: '',
      },
      medicationUse: {
        currentlyTakingMedications: '',
        medicationsList: '',
      },
      symptomsSeverity: '',
    },
    age: '',
    height: '',
    weight: '',
    fatigue: false,
    fever: false,
    pain: false,
    shortnessOfBreath: false,
    nausea: false,
    dizziness: false,
    headache: false,
    cough: false,
    soreThroat: false,
    runnyNose: false,
    muscleAche: false,
    lossOfAppetite: false,
    chestPain: false,
    otherSymptoms: '',
  });
  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const context = "Patient reports fatigue and occasional dizziness";
    const question = "What could be the possible causes?";
  
    try {
      const response = await fetch('/api/processData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, question }),
      });
  
      const data = await response.json();
      if (data.success) {
        console.log("AI Response:", data.response);
        alert(`AI Response: ${data.response}`);
      } else {
        console.error("Error:", data.error);
        alert("Failed to get AI response. Try again later.");
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  
const updateNestedField = (name, value) => {
    const keys = name.split('.');
    setFormData(prevState => {
      let newState = { ...prevState };
      let currentLevel = newState;
      for (let i = 0; i < keys.length - 1; i++) {
        currentLevel[keys[i]] = { ...currentLevel[keys[i]] }; // clone each level
        currentLevel = currentLevel[keys[i]];
      }
      currentLevel[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Handle checkboxes and nested fields
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (name.includes('.')) {
      // Update nested fields using dot notation
      const keys = name.split('.');
      setFormData((prevData) => {
        const updatedData = { ...prevData };
        let currentLevel = updatedData;
        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            currentLevel[key] = value;
          } else {
            currentLevel = currentLevel[key];
          }
        });
        return updatedData;
      });
    } else {
      // Handle top-level fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
  
    if (name.includes('.')) {
      // Handle nested keys with dot notation using updateNestedField
      updateNestedField(name, value);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  
  
  

  const handleNextStep = () => {
    setStep((prevStep) => Math.min(prevStep + 1, 15)); // Ensure step doesn't go beyond 15
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1)); // Ensure step doesn't go below 1
  };

  const progressPercentage = (step / 15) * 100;

  const StepRenderer = () => {
    switch (step) {
      case 1:
        return <Step1 onNext={handleNextStep} />;
      case 2:
        return <Step2 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 3:
        return <Step3 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 4:
        return <Step4 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 5:
        return <Step5 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 6:
        return <Step6 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 7:
        return <Step7 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 8:
        return <Step8 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 9:
        return <Step9 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 10:
        return <Step10 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 11:
        return <Step11 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 12:
        return <Step12 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 13:
        return <Step13 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 14:
        return <Step14 formData={formData} handleSelectChange={handleSelectChange} onNext={handleNextStep} />;
      case 15:
        return <Step15 formData={formData} handleSelectChange={handleSelectChange} onSubmit={handleSubmit} />;
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="form-container">
      <h1>Transforming Your Health, One Step at a Time!</h1>
      <ProgressBar className='bar' now={progressPercentage} label={`${Math.round(progressPercentage)}%`} />
      <StepRenderer />

      <div className="buttons-container">
        <Button 
          className="form-button prev-button" 
          onClick={handlePreviousStep} 
          disabled={step === 1}>
          Previous
        </Button>

        {step < 15 ? (
          <Button 
            className="form-button next-button" 
            onClick={handleNextStep}>
            Next
          </Button>
        ) : (
          <Button 
            className="form-button submit-button" 
            onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default CustomForm;
