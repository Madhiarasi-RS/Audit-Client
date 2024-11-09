import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png'; // Replace with the actual path to your logo image
// Optional: Add a CSS file for custom styling

const Navbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/Login'); // Navigates to Login.jsx page
  };

  return (
    <>
    <nav style={styles.navbar}>
      {/* Logo and Title */}
      <div style={styles.leftContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>Audit Governance Platform</h1>
      </div>

      {/* Login Button */}
      <div style={styles.rightContainer}>
        <button onClick={handleLoginClick} style={styles.loginButton}>
         Login
        </button>
      </div>
    </nav> 
    </>
  );
};

// Inline Styles
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#001f3f', // Navy blue color
    color: '#ffffff',
  },
  leftContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '40px', // Adjust as needed
    marginRight: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  loginButton: {
    padding: '8px 16px',
    backgroundColor: '#333', // Blue button color
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Navbar;
