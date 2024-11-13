import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Optionally, you can check login status based on some criteria like a session or flag
    // For now, we keep it simple and assume user will be logged in based on state.
    if (localStorage.getItem('userLoggedIn')) {
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
        setIsLoggedIn(true);
        localStorage.setItem('userLoggedIn', 'true'); // Store login status (not token)
        navigate('/form'); // Redirect to Form page
      } else {
        alert("Login failed: " + data.error);
      }
    } catch (error) {
      alert("Error during login: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn'); // Remove login status
    setIsLoggedIn(false); 
    alert("Logged out successfully!");
    navigate('/login'); // Redirect to login page
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




