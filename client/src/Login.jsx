import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl, readJsonResponse } from './api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userLoggedIn') || localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(buildApiUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await readJsonResponse(response);
      if (response.ok) {
        alert('Login successful!');
        setIsLoggedIn(true);
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('token', data.token || data.user?.id || email);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        navigate('/form');
      } else {
        alert(`Login failed: ${data.error}`);
      }
    } catch (error) {
      alert(`Error during login: ${error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    alert('Logged out successfully!');
    navigate('/login');
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      ) : (
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="form-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="form-input"
          />
          <button type="submit" className="submit-button">
            Log In
          </button>
          <button
            type="button"
            onClick={handleSignupRedirect}
            className="signup-button"
          >
            If New Sign Up
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;
