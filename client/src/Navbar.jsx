import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // This effect will run when the component mounts and when localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      // Check if the token exists in localStorage
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    // Check the login status once on component mount
    checkLoginStatus();

    // Listen for changes to localStorage
    window.addEventListener('storage', checkLoginStatus);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleLogout = () => {
    // Remove token from localStorage and update state
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Update state to reflect logout
    navigate('/login'); // Redirect to login page
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1040/1040238.png"
            alt="Healthify Logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          Healthify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            <NavDropdown title="User" id="collasible-nav-dropdown">
              {isLoggedIn ? (
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/signup">SignUp</NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;






