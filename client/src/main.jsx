import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './Navbar.jsx'; // Import the NavBar component
import Signup from './Signup.jsx';
import Login from './Login.jsx'; // Import the Login component
import Home from './Home.jsx'; // Import the Home component
import About from './About.jsx'; // Import the About component
import Contact from './Contact.jsx'; // Import the Contact component
import CustomForm from './Form.jsx'; // Adjust the path if necessary
import FinalPage from './FinalPage.jsx';

const App = () => {
  return (
    <div className="app-container">
      <NavBar /> {/* Render NavBar at the top of all pages */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Add default route for Home */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<CustomForm />} />
        <Route path='/result' element={<FinalPage/>} />
      </Routes>
    </div>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);

