import { useEffect, useRef, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  useEffect(() => {
    setIsLoggedIn(
      Boolean(localStorage.getItem('token')) ||
        localStorage.getItem('userLoggedIn') === 'true',
    );
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        expanded
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setExpanded(false);
    navigate('/login');
  };

  const handleNavClick = () => {
    setExpanded(false);
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
          <Navbar.Brand
            as={Link}
            to="/"
            className="modern-brand"
            onClick={handleNavClick}
          >
        <img
  src="/logo.png"
  alt="Healthify Logo"
  width="28"
  height="28"
  className="d-inline-block align-top brand-icon"
/>
            Healthify
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            className="modern-toggler"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto modern-nav">
              <Nav.Link
                as={Link}
                to="/"
                className="modern-nav-link"
                onClick={handleNavClick}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/about"
                className="modern-nav-link"
                onClick={handleNavClick}
              >
                About
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                className="modern-nav-link"
                onClick={handleNavClick}
              >
                Contact
              </Nav.Link>
              <NavDropdown
                title="User"
                id="collasible-nav-dropdown"
                className="modern-dropdown"
              >
                {isLoggedIn ? (
                  <NavDropdown.Item
                    onClick={handleLogout}
                    className="modern-dropdown-item"
                  >
                    Logout
                  </NavDropdown.Item>
                ) : (
                  <>
                    <NavDropdown.Item
                      as={Link}
                      to="/login"
                      className="modern-dropdown-item"
                      onClick={handleNavClick}
                    >
                      Login
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      to="/signup"
                      className="modern-dropdown-item"
                      onClick={handleNavClick}
                    >
                      SignUp
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>
              {!isLoggedIn ? (
                <div className="modern-cta-container">
                  <Link
                    to="/landing"
                    className="modern-cta-btn"
                    onClick={handleNavClick}
                  >
                    Landing
                  </Link>
                </div>
              ) : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
