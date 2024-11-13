import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Signup.css'; // Import the CSS file for styling

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignup = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
        console.log("Signup successful:", data);
        // Automatically log the user in by storing the token and redirecting
        localStorage.setItem("token", data.token);
        navigate('/form'); // Redirect directly to the main page after auto-login
      } else {
        alert("Signup failed: " + data.error);
        console.log("Signup failed:", data);
      }
    } catch (error) {
      alert("Error during signup: " + error.message);
      console.error("Error during signup:", error);
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSignup}>
      <input
        className="form-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="form-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="form-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="submit-button" type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;




