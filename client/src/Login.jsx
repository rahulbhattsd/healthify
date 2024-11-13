
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true); 
    }
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        navigate('/form'); // Redirect to Form page
      } else {
        alert("Login failed: " + data.error);
      }
    } catch (error) {
      alert("Error during login: " + error.message);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false); 
    alert("Logged out successfully!");
    navigate('/login'); 
  };

  const handleSignupRedirect = () => {
    navigate('/signup'); // Redirect to signup route
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <button onClick={handleLogout} className="logout-button">Log Out</button>
      ) : (
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
          <button type="submit" className="submit-button">Log In</button>
          <button type="button" onClick={handleSignupRedirect} className="signup-button">
           If New Sign Up
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;





