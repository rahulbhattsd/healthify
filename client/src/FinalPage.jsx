// FinalPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
  

const FinalPage = ({ formData }) => {
  const [aiResponse, setAiResponse] = useState(null);
   const navigate = useNavigate();
  useEffect(() => {
    const fetchAIResponse = async () => {
      try {
        const response = await axios.post('/generate-response', { formData });
        setAiResponse(response.data.response);
      } catch (error) {
        console.error('Error fetching AI response:', error);
      }
    };
    fetchAIResponse();
  }, [formData]);



  const handelPreviousResponse=()=>{
    navigate('/');
   } ;

  return (
    <div className="final-page">
      <h2>Your Personalized Recommendations</h2>
      {aiResponse ? (
        <div className="recommendations">
          <p>{aiResponse}</p>
          {/* Additional structured response rendering can go here */}
        </div>
      ) : (
        <p>Loading recommendations...</p>
      )}
      
      <button className="back-button" onClick={handelPreviousResponse}>
       Back to Previous Step
      </button>

    </div>
  );
};

export default FinalPage;
