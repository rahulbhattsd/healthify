import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const navbarRef = useRef(null);

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

  // Handle click outside to close navbar on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target) && expanded) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]);

  const handleLogout = () => {
    // Remove token from localStorage and update state
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Update state to reflect logout
    setExpanded(false); // Close mobile menu
    navigate('/login'); // Redirect to login page
  };

  const handleNavClick = () => {
    setExpanded(false); // Close mobile menu when nav item is clicked
  };

  return (
    <div ref={navbarRef}>
      <Navbar 
        collapseOnSelect 
        expand="lg" 
        className="modern-transparent-navbar" 
        variant="dark" 
        fixed="top"
        expanded={expanded}
        onToggle={setExpanded}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="modern-brand" onClick={handleNavClick}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/1040/1040238.png"
              alt="Healthify Logo"
              width="28"
              height="28"
              className="d-inline-block align-top brand-icon"
            />
            Healthify
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" className="modern-toggler" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto modern-nav">
              <Nav.Link as={Link} to="/" className="modern-nav-link" onClick={handleNavClick}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="modern-nav-link" onClick={handleNavClick}>
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="modern-nav-link" onClick={handleNavClick}>
                Contact
              </Nav.Link>
              <NavDropdown title="User" id="collasible-nav-dropdown" className="modern-dropdown">
                {isLoggedIn ? (
                  <NavDropdown.Item onClick={handleLogout} className="modern-dropdown-item">
                    Logout
                  </NavDropdown.Item>
                ) : (
                  <>
                    <NavDropdown.Item as={Link} to="/login" className="modern-dropdown-item" onClick={handleNavClick}>
                      Login
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/signup" className="modern-dropdown-item" onClick={handleNavClick}>
                      SignUp
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
              {!isLoggedIn && (
                <div className="modern-cta-container">
                  <Link to="/landing" className="modern-cta-btn" onClick={handleNavClick}>
                    Landing 
                  </Link>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;





