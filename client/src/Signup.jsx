import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl, readJsonResponse } from './api';
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(buildApiUrl('/api/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await readJsonResponse(response);
      if (response.ok) {
        alert('Signup successful!');
        console.log('Signup successful:', data);
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('token', data.token || data.user?.id || email || username);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        navigate('/form');
      } else {
        alert(`Signup failed: ${data.error}`);
        console.log('Signup failed:', data);
      }
    } catch (error) {
      alert(`Error during signup: ${error.message}`);
      console.error('Error during signup:', error);
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSignup}>
      <input
        className="form-input"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />
      <input
        className="form-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <input
        className="form-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <button className="submit-button" type="submit">
        Sign Up
      </button>
    </form>
  );
};

export default Signup;
